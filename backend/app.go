package backend

import (
	"bytes"
	"context"
	"fmt"
	"math"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/disintegration/imaging"
	ort "github.com/yalue/onnxruntime_go"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	publicImagePath = "./frontend/public/images"
	modelPath       = "resnet_epoch_100.onnx"

	// ImageNet 标准化参数
	mean = []float32{0.485, 0.456, 0.406}
	std  = []float32{0.229, 0.224, 0.225}

	// 猫品种标签
	labelName = []string{
		"american_shorthair",
		"bengal",
		"british_shorthair",
		"exotic_shorthair",
		"maine_coon",
		"ragdoll",
		"sphynx",
	}
)

func NewApp() *App {
	return &App{}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx

	// 设置 ONNX Runtime DLL 路径
	exeDir, _ := os.Executable()
	println("exeDir", exeDir)
	ort.SetSharedLibraryPath(filepath.Join(filepath.Dir(exeDir), "onnxruntime.dll"))

	// 初始化 ONNX Runtime 环境
	err := ort.InitializeEnvironment()
	if err != nil {
		panic("Failed to initialize ONNX runtime: " + err.Error())
	}
}

func preprocessImage(imgData []byte) ([]float32, error) {
	// 解码图片
	reader := bytes.NewReader(imgData)
	img, err := imaging.Decode(reader, imaging.AutoOrientation(true))
	if err != nil {
		return nil, fmt.Errorf("decode image: %w", err)
	}

	// 缩放到 224x224
	img = imaging.Resize(img, 224, 224, imaging.Lanczos)

	// 转换为 float32 数组 (NCHW 格式: 1, 3, 224, 224)
	input := make([]float32, 1*3*224*224)

	bounds := img.Bounds()
	idx := 0
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			r, g, b, _ := img.At(x, y).RGBA()
			// RGBA 返回 0-65535，需要转换到 0-255
			rf := float32(r>>8) / 255.0
			gf := float32(g>>8) / 255.0
			bf := float32(b>>8) / 255.0

			// ImageNet 标准化
			input[idx] = (rf - mean[0]) / std[0]           // R channel
			input[idx+224*224] = (gf - mean[1]) / std[1]   // G channel
			input[idx+224*224*2] = (bf - mean[2]) / std[2] // B channel
			idx++
		}
	}

	return input, nil
}

func runInference(input []float32) (string, float64, error) {
	// 创建输入张量 [1, 3, 224, 224]
	inputTensor, err := ort.NewTensor(ort.Shape{1, 3, 224, 224}, input)
	if err != nil {
		return "", 0, fmt.Errorf("create input tensor: %w", err)
	}
	defer inputTensor.Destroy()

	// 创建输出张量 [1, 7]
	outputTensor, err := ort.NewTensor(ort.Shape{1, 7}, make([]float32, 7))
	if err != nil {
		return "", 0, fmt.Errorf("create output tensor: %w", err)
	}
	defer outputTensor.Destroy()

	exeDir, _ := os.Executable()
	println("exeDir222", exeDir)

	// 创建 session 并运行推理
	session, err := ort.NewAdvancedSession(
		filepath.Join(filepath.Dir(exeDir), modelPath),
		[]string{"input"},
		[]string{"output"},
		[]ort.Value{inputTensor},
		[]ort.Value{outputTensor},
		nil,
	)
	if err != nil {
		return "", 0, fmt.Errorf("create session: %w", err)
	}
	defer session.Destroy()

	err = session.Run()
	if err != nil {
		return "", 0, fmt.Errorf("run inference: %w", err)
	}

	// 获取输出
	outputData := outputTensor.GetData()

	// 找最大值的索引
	maxIdx := 0
	maxVal := outputData[0]
	for i := 1; i < len(outputData); i++ {
		if outputData[i] > maxVal {
			maxVal = outputData[i]
			maxIdx = i
		}
	}

	// Softmax 计算置信度
	var sum float64
	for _, v := range outputData {
		sum += math.Exp(float64(v))
	}
	confidence := math.Exp(float64(maxVal)) / sum

	return labelName[maxIdx], confidence, nil
}

func (a *App) GormDB() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open("app.db"), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	return db, nil
}

func (a *App) UploadImage(data []byte, filename string) Response {
	uploadsDir := publicImagePath
	err := os.MkdirAll(uploadsDir, 0755)
	if err != nil {
		return Response{Code: 1, Message: "failed", Data: err.Error()}
	}

	ext := filepath.Ext(filename)
	newFilename := strconv.FormatInt(time.Now().UnixMilli(), 10) + ext
	filePath := filepath.Join(uploadsDir, newFilename)

	err = os.WriteFile(filePath, data, 0644)
	if err != nil {
		return Response{Code: 1, Message: "failed", Data: err.Error()}
	}

	println("333")

	return Response{Code: 0, Message: "success", Data: newFilename}
}

func (a *App) GetHistory(page int, pageSize int) Response {
	db, err := a.GormDB()
	if err != nil {
		return Response{Code: 1, Message: err.Error()}
	}

	var total int64
	db.Table("history_test").Count(&total)

	var historyList []HistoryWithBreed
	err = db.Table("history_test").Select("history_test.*, breeds_test.brief, breeds_test.name").
		Joins("LEFT JOIN breeds_test ON history_test.breed = breeds_test.id").
		Order("history_test.id DESC").Limit(pageSize).Offset((page - 1) * pageSize).Find(&historyList).Error

	if err != nil {
		return Response{Code: 1, Message: err.Error()}
	}

	historyData := HistoryData{Page: page, PageSize: pageSize, Total: total, List: historyList}

	return Response{Code: 0, Message: "success", Data: historyData}
}

func (a *App) Detect(filename string) Response {
	db, err := a.GormDB()
	if err != nil {
		return Response{Code: 1, Message: err.Error()}
	}

	filePath := filepath.Join(publicImagePath, filename)
	imgData, err := os.ReadFile(filePath)
	if err != nil {
		return Response{Code: 1, Message: "failed to read image: " + err.Error()}
	}

	input, err := preprocessImage(imgData)
	if err != nil {
		return Response{Code: 1, Message: "failed to preprocess: " + err.Error()}
	}

	// 推理
	detectRet, confidence, err := runInference(input)
	if err != nil {
		return Response{Code: 1, Message: "model inference failed: " + err.Error()}
	}

	var breed Breed
	err = db.Table("breeds_test").Where("code = ?", detectRet).First(&breed).Error
	if err != nil {
		return Response{Code: 1, Message: err.Error()}
	}

	now := int(time.Now().Unix())

	one := HistoryItem{Img: filename, Breed: int(breed.Id), Date: now}
	result := db.Table("history_test").Create(&one)
	if result.Error != nil {
		return Response{Code: 1, Message: result.Error.Error()}
	}

	detectData := DetectData{
		Id:              breed.Id,
		Code:            breed.Code,
		Name:            breed.Name,
		Brief:           breed.Brief,
		ConfidenceLevel: confidence,
	}

	return Response{Code: 0, Message: "success", Data: detectData}
}

func (a *App) DeleteOneHistory(id uint) Response {
	db, err := a.GormDB()
	if err != nil {
		return Response{Code: 1, Message: err.Error()}
	}

	result := db.Table("history_test").Delete(&HistoryItem{}, id)
	if result.Error != nil {
		return Response{Code: 1, Message: result.Error.Error()}
	}

	return Response{Code: 0, Message: "success"}
}

func (a *App) ClearHistory() Response {
	db, err := a.GormDB()
	if err != nil {
		return Response{Code: 1, Message: err.Error()}
	}

	result := db.Exec("DELETE FROM history_test")
	if result.Error != nil {
		return Response{Code: 1, Message: result.Error.Error()}
	}

	if err := os.RemoveAll(publicImagePath); err != nil {
		return Response{Code: 1, Message: fmt.Sprintf("failed to remove images: %v", err)}
	}
	if err := os.MkdirAll(publicImagePath, 0755); err != nil {
		return Response{Code: 1, Message: fmt.Sprintf("failed to recreate images dir: %v", err)}
	}

	return Response{Code: 0, Message: "success"}
}
