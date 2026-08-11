package backend

import (
	"context"
)

type (
	App struct {
		ctx context.Context
	}

	Response struct {
		Code    int         `json:"code"`
		Message string      `json:"message"`
		Data    interface{} `json:"data,omitempty"`
	}

	HistoryItem struct {
		Id    uint   `gorm:"primaryKey"`
		Img   string `gorm:"column:img"`
		Breed int    `gorm:"column:breed"`
		Date  int    `gorm:"column:date"`
	}

	HistoryWithBreed struct {
		Id    uint   `gorm:"column:id"         json:"id"`
		Img   string `gorm:"column:img"        json:"img"`
		Breed int    `gorm:"column:breed"      json:"breed"`
		Date  int    `gorm:"column:date"       json:"date"`
		Name  string `gorm:"column:name"       json:"name"`
		Brief string `gorm:"column:brief"      json:"brief"`
	}

	HistoryData struct {
		Page     int                `json:"page"`
		PageSize int                `json:"page_size"`
		Total    int64              `json:"total"`
		List     []HistoryWithBreed `json:"list"`
	}

	Breed struct {
		Id    uint   `gorm:"primaryKey"`
		Code  string `gorm:"column:code"`
		Name  string `gorm:"column:name"`
		Brief string `gorm:"column:brief"`
	}

	DetectData struct {
		Id              uint    `json:"id"`
		Code            string  `json:"code"`
		Name            string  `json:"name"`
		Brief           string  `json:"brief"`
		ConfidenceLevel float64 `json:"confidence_level"`
	}
)
