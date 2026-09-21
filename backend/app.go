package backend

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"math"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/disintegration/imaging"
	ort "github.com/yalue/onnxruntime_go"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	staticImagesPath = "./static/images"
	modelPath        = "resnet18_epoch_50.onnx"

	// ImageNet 标准化参数
	mean = []float32{0.485, 0.456, 0.406}
	std  = []float32{0.229, 0.224, 0.225}
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

	// 初始化数据库连接（复用）
	dbPath := filepath.Join(filepath.Dir(exeDir), "app.db")
	a.db, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		panic("Failed to open database: " + err.Error())
	}

	// 预加载 labels
	a.labels, err = a.loadLabels()
	if err != nil {
		panic("Failed to load labels: " + err.Error())
	}

	// 初始化 ONNX session（复用）
	a.session, err = a.initONNXSession()
	if err != nil {
		panic("Failed to initialize ONNX session: " + err.Error())
	}
}

func (a *App) loadLabels() ([]string, error) {
	var labels []string
	err := a.db.Table("breeds").Pluck("code", &labels).Error
	return labels, err
}

func (a *App) initONNXSession() (*ort.AdvancedSession, error) {
	exeDir, _ := os.Executable()
	modelFilePath := filepath.Join(filepath.Dir(exeDir), modelPath)

	inputTensor, err := ort.NewTensor(ort.Shape{1, 3, 224, 224}, make([]float32, 1*3*224*224))
	if err != nil {
		return nil, fmt.Errorf("create input tensor: %w", err)
	}
	defer inputTensor.Destroy()

	outputTensor, err := ort.NewTensor(ort.Shape{1, 12}, make([]float32, 12))
	if err != nil {
		return nil, fmt.Errorf("create output tensor: %w", err)
	}
	defer outputTensor.Destroy()

	session, err := ort.NewAdvancedSession(
		modelFilePath,
		[]string{"input"},
		[]string{"output"},
		[]ort.Value{inputTensor},
		[]ort.Value{outputTensor},
		nil,
	)
	if err != nil {
		return nil, fmt.Errorf("create session: %w", err)
	}
	return session, nil
}

func (a *App) Shutdown() {
	if a.session != nil {
		a.session.Destroy()
	}
	if a.db != nil {
		sqlDB, _ := a.db.DB()
		if sqlDB != nil {
			sqlDB.Close()
		}
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

	// 转换为 RGBA 格式（统一4通道）
	rgba := imaging.Clone(img)

	// 转换为 float32 数组 (NCHW 格式: 1, 3, 224, 224)
	input := make([]float32, 1*3*224*224)

	bounds := rgba.Bounds()
	idx := 0
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			// 强制转换为 RGBA，确保4通道
			r, g, b, _ := rgba.At(x, y).RGBA()
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

func (a *App) runInference(input []float32) (string, float64, error) {
	// 每次推理创建新的 tensor（因为输入数据不同），但 session 复用
	inputTensor, err := ort.NewTensor(ort.Shape{1, 3, 224, 224}, input)
	if err != nil {
		return "", 0, fmt.Errorf("create input tensor: %w", err)
	}
	defer inputTensor.Destroy()

	outputTensor, err := ort.NewTensor(ort.Shape{1, 12}, make([]float32, 12))
	if err != nil {
		return "", 0, fmt.Errorf("create output tensor: %w", err)
	}
	defer outputTensor.Destroy()

	// 使用 App 中预加载的 session（通过 AdvancedSession 复用）
	exeDir, _ := os.Executable()
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

	start := time.Now()
	err = session.Run()
	elapsed := time.Since(start)
	println("Inference time:", elapsed.String())
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

	return a.labels[maxIdx], confidence, nil
}

func (a *App) GormDB() *gorm.DB {
	return a.db
}

func (a *App) UploadImage(data []byte, filename string) Response {
	uploadsDir := staticImagesPath
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

	imageResult := map[string]any{
		"filename": newFilename,
		"data":     base64.StdEncoding.EncodeToString(data),
	}

	return Response{Code: 0, Message: "success", Data: imageResult}
}

// validateFilename 检查文件名是否安全，防止路径遍历攻击
func validateFilename(filename string) error {
	// 禁止包含路径分隔符
	if strings.ContainsAny(filename, "/\\") {
		return fmt.Errorf("invalid filename")
	}
	// 禁止 .. 路径遍历
	if strings.Contains(filename, "..") {
		return fmt.Errorf("invalid filename")
	}
	return nil
}

func (a *App) Detect(filename string) Response {
	db := a.GormDB()

	if err := validateFilename(filename); err != nil {
		return Response{Code: 1, Message: "invalid filename"}
	}

	filePath := filepath.Join(staticImagesPath, filename)
	imgData, err := os.ReadFile(filePath)
	if err != nil {
		return Response{Code: 1, Message: "failed to read image: " + err.Error()}
	}

	input, err := preprocessImage(imgData)
	if err != nil {
		return Response{Code: 1, Message: "failed to preprocess: " + err.Error()}
	}

	// 推理（使用 App 中预加载的 labels）
	detectRet, confidence, err := a.runInference(input)
	if err != nil {
		return Response{Code: 1, Message: "model inference failed: " + err.Error()}
	}
	confidence = math.Round(confidence*10000) / 10000

	var breed Breed
	err = db.Table("breeds").Where("code = ?", detectRet).First(&breed).Error
	if err != nil {
		return Response{Code: 1, Message: err.Error()}
	}

	now := int(time.Now().Unix())
	print("confidence", confidence)

	one := HistoryItem{Img: filename, Breed: int(breed.Id), Confidence: confidence, Date: now}
	result := db.Table("history").Create(&one)
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

func (a *App) GetHistory(page int, pageSize int) Response {
	db := a.GormDB()

	var total int64
	db.Table("history").Count(&total)

	var historyList []HistoryWithBreed
	err := db.Table("history").Select("history.*, breeds.brief, breeds.name").
		Joins("LEFT JOIN breeds ON history.breed = breeds.id").
		Order("history.id DESC").Limit(pageSize).Offset((page - 1) * pageSize).Find(&historyList).Error

	if err != nil {
		return Response{Code: 1, Message: err.Error()}
	}

	for i := range historyList {
		imgPath := filepath.Join(staticImagesPath, historyList[i].Img)
		if data, err := os.ReadFile(imgPath); err == nil {
			historyList[i].ImgData = base64.StdEncoding.EncodeToString(data)
		}
	}

	historyData := HistoryData{Page: page, PageSize: pageSize, Total: total, List: historyList}

	return Response{Code: 0, Message: "success", Data: historyData}
}

func (a *App) DeleteOneHistory(id uint) Response {
	db := a.GormDB()

	// 先查询获取图片文件名
	var item HistoryItem
	if err := db.Table("history").Where("id = ?", id).First(&item).Error; err != nil {
		return Response{Code: 1, Message: err.Error()}
	}

	// 删除图片文件
	imgPath := filepath.Join(staticImagesPath, item.Img)
	os.Remove(imgPath)

	result := db.Table("history").Delete(&HistoryItem{}, id)
	if result.Error != nil {
		return Response{Code: 1, Message: result.Error.Error()}
	}

	return Response{Code: 0, Message: "success"}
}

func (a *App) ClearHistory() Response {
	db := a.GormDB()

	result := db.Exec("DELETE FROM history")
	if result.Error != nil {
		return Response{Code: 1, Message: result.Error.Error()}
	}

	if err := os.RemoveAll(staticImagesPath); err != nil {
		return Response{Code: 1, Message: fmt.Sprintf("failed to remove images: %v", err)}
	}
	if err := os.MkdirAll(staticImagesPath, 0755); err != nil {
		return Response{Code: 1, Message: fmt.Sprintf("failed to recreate images dir: %v", err)}
	}

	return Response{Code: 0, Message: "success"}
}
