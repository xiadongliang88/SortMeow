package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	publicImagePath = "./frontend/public/images"
)

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
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
	newFilename := fmt.Sprintf("%d%s", time.Now().UnixMilli(), ext)
	filePath := filepath.Join(uploadsDir, newFilename)

	err = os.WriteFile(filePath, data, 0644)
	if err != nil {
		return Response{Code: 1, Message: "failed", Data: err.Error()}
	}

	return Response{Code: 0, Message: "success", Data: newFilename}
}

func (a *App) GetImage(filename string) Response {
	filePath := filepath.Join(publicImagePath, filename)

	data, err := os.ReadFile(filePath)
	if err != nil {
		return Response{Code: 1, Message: "failed", Data: err.Error()}
	}

	ext := filepath.Ext(filename)
	mimeType := "image/jpeg"
	if ext == ".png" {
		mimeType = "image/png"
	}

	base64Data := base64.StdEncoding.EncodeToString(data)
	dataURL := "data:image/" + mimeType + ";base64," + base64Data

	return Response{Code: 0, Message: "success", Data: dataURL}
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

func (a *App) Detect(img string) Response {
	db, err := a.GormDB()
	if err != nil {
		return Response{Code: 1, Message: err.Error()}
	}

	var breed Breed
	detectRet := "british_shorthair"
	err = db.Table("breeds_test").Where("code = ?", detectRet).First(&breed).Error
	if err != nil {
		return Response{Code: 1, Message: err.Error()}
	}

	now := int(time.Now().Unix())

	one := HistoryItem{Img: img, Breed: int(breed.Id), Date: now}
	result := db.Table("history_test").Create(&one)
	if result.Error != nil {
		return Response{Code: 1, Message: result.Error.Error()}
	}

	detectData := DetectData{
		Id:              breed.Id,
		Code:            breed.Code,
		Name:            breed.Name,
		Brief:           breed.Brief,
		ConfidenceLevel: 0.98,
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
