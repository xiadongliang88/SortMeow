package main

type ImageResult struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    string `json:"data,omitempty"` // 成功时返回文件路径
}
