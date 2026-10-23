// Command initdb 在指定的输出目录中准备应用运行所需的数据文件：
//
//	app.db            SQLite 数据库（含 breeds / history 表结构与品种基础数据）
//	static/images/    上传图片存放目录
//
// 通常由 wails.json 的 postBuildHooks 调用，使 `wails build` 产出的
// bin 目录自带可直接运行的数据库与图片目录：
//
//	"postBuildHooks": { "*/*": "go run ../cmd/initdb" }
//
// 也可以手动执行：
//
//	go run ./cmd/initdb -out build/bin
package main

import (
	"flag"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"

	"sortmeow/backend/dbinit"
)

func main() {
	out := flag.String("out", "", "输出目录（默认 <项目根目录>/build/bin）")
	copyRuntime := flag.Bool("copy-runtime", true, "同时复制 ONNX 模型与 onnxruntime.dll 到输出目录（缺失时）")
	flag.Parse()

	dir := *out
	if dir == "" {
		dir = defaultOutDir()
	}
	absDir, err := filepath.Abs(dir)
	if err != nil {
		fail("解析输出目录失败: %v", err)
	}

	if err := dbinit.Init(absDir); err != nil {
		fail("初始化数据文件失败: %v", err)
	}
	fmt.Printf("已就绪: %s\n", dbinit.DBPath(absDir))
	fmt.Printf("已就绪: %s\n", dbinit.ImagesDir(absDir))

	if *copyRuntime {
		copyRuntimeAssets(absDir)
	}
}

// defaultOutDir 通过本文件位置反推项目根目录，返回 <项目根>/build/bin
func defaultOutDir() string {
	if _, file, _, ok := runtime.Caller(0); ok {
		// file = <项目根>/cmd/initdb/main.go
		root := filepath.Dir(filepath.Dir(filepath.Dir(file)))
		return filepath.Join(root, "build", "bin")
	}
	return filepath.Join("build", "bin")
}

// copyRuntimeAssets 把运行所需的模型与 ONNX Runtime 动态库复制到输出目录（已存在则跳过）
func copyRuntimeAssets(dir string) {
	root := projectRoot()

	// ONNX 模型
	modelDir := filepath.Join(root, "core", "models")
	for _, name := range []string{"resnet18_epoch_50.onnx", "resnet18_epoch_50.onnx.data"} {
		copyFile(filepath.Join(modelDir, name), filepath.Join(dir, name))
	}

	// ONNX Runtime 动态库（取自 Go 模块缓存）
	if dll := findOnnxRuntimeDLL(root); dll != "" {
		copyFile(dll, filepath.Join(dir, "onnxruntime.dll"))
	}
}

// findOnnxRuntimeDLL 在 Go 模块缓存中查找 onnxruntime.dll
func findOnnxRuntimeDLL(root string) string {
	cmd := exec.Command("go", "list", "-m", "-f", "{{.Dir}}", "github.com/yalue/onnxruntime_go")
	cmd.Dir = root
	out, err := cmd.Output()
	if err != nil {
		return ""
	}
	dir := strings.TrimSpace(string(out))
	if dir == "" {
		return ""
	}
	return filepath.Join(dir, "test_data", "onnxruntime.dll")
}

// projectRoot 返回项目根目录
func projectRoot() string {
	if _, file, _, ok := runtime.Caller(0); ok {
		return filepath.Dir(filepath.Dir(filepath.Dir(file)))
	}
	return "."
}

// copyFile 复制文件，已存在则跳过
func copyFile(src, dst string) {
	if _, err := os.Stat(src); err != nil {
		fmt.Printf("跳过（源文件不存在）: %s\n", src)
		return
	}
	if _, err := os.Stat(dst); err == nil {
		fmt.Printf("跳过（已存在）: %s\n", filepath.Base(dst))
		return
	}

	in, err := os.Open(src)
	if err != nil {
		fmt.Printf("复制失败 %s: %v\n", src, err)
		return
	}
	defer in.Close()

	out, err := os.Create(dst)
	if err != nil {
		fmt.Printf("复制失败 %s: %v\n", dst, err)
		return
	}
	defer out.Close()

	if _, err := io.Copy(out, in); err != nil {
		fmt.Printf("复制失败 %s: %v\n", dst, err)
		return
	}
	fmt.Printf("已复制: %s\n", filepath.Base(dst))
}

func fail(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "initdb: "+format+"\n", args...)
	os.Exit(1)
}
