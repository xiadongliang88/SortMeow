package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name

func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) Login() string {
	println("1111")
	return ""
}

func (a *App) Register() string {
	println("1111")
	return ""
}

func (a *App) UploadImage(data []byte, filename string) ImageResult {
	uploadsDir := "./uploads"
	err := os.MkdirAll(uploadsDir, 0755)
	if err != nil {
		return ImageResult{Code: 1, Message: "failed", Data: fmt.Sprintf("创建目录失败: %v", err)}
	}

	ext := filepath.Ext(filename)
	newFilename := fmt.Sprintf("%d%s", time.Now().UnixMilli(), ext)
	filePath := filepath.Join(uploadsDir, newFilename)

	err = os.WriteFile(filePath, data, 0644)
	if err != nil {
		return ImageResult{Code: 1, Message: "failed", Data: fmt.Sprintf("保存文件失败: %v", err)}
	}

	return ImageResult{Code: 0, Message: "success", Data: newFilename}
}

func (a *App) GetImage(filename string) ImageResult {
	filePath := filepath.Join("./uploads", filename)
	fmt.Println("filePath", filePath)
	data, err := os.ReadFile(filePath)
	if err != nil {
		return ImageResult{Code: 1, Message: "failed", Data: fmt.Sprintf("打开文件路径失败: %v", err)}
	}
	ext := filepath.Ext(filename)
	mimeType := "image/jpeg"
	if ext == ".png" {
		mimeType = "image/png"
	}
	// app.go - GetImage
	return ImageResult{Code: 0, Message: "success", Data: fmt.Sprintf("data:image/%s;base64,%s", mimeType, base64.StdEncoding.EncodeToString(data))}

	// return ImageResult{Code: 1, Message: "failed", Data: data}
}
