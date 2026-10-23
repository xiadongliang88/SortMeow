# 分类喵（CatBreed）· 猫咪品种识别桌面应用

基于 Wails 框架 + ResNet18 深度学习模型构建的桌面应用，支持图片上传、猫咪品种识别与识别历史管理。

[Switch to English](./README.md)

![Wails](https://img.shields.io/badge/Wails-桌面%20应用-blue)
![Preact](https://img.shields.io/badge/Preact-前端%20TS-green)
![Go](https://img.shields.io/badge/Go-后端-blue)
![ONNX](https://img.shields.io/badge/ONNX-推理-orange)

## 功能特性

- **📸 拖拽上传** —— 拖拽或点击上传猫咪照片（JPG / PNG / JPEG）
- **🔍 品种识别** —— 基于 ResNet18 深度残差网络识别 12 种常见猫咪品种
- **📊 置信度展示** —— 展示模型预测的置信度百分比
- **📜 历史记录** —— 自动保存每次识别结果，支持分页浏览
- **🗑️ 记录管理** —— 支持删除单条记录或一键清空全部历史
- **💾 本地存储** —— 使用 SQLite 数据库存储历史数据

## 架构设计

```
┌─────────────────────────────────────────────────────┐
│                    Wails Framework                  │
├──────────────────────┬──────────────────────────────┤
│   前端（Preact/TS）  │        后端（Go）             │
│   ─────────────────  │   ────────────────────────── │
│   • components/      │   • app.go（业务接口）        │
│     Main.tsx         │   • types.go（数据结构）      │
│     History.tsx      │   • ONNX Runtime 推理         │
│     Modal.tsx 等     │   • GORM + SQLite             │
│   • pages/app.tsx    │                              │
│   • styles/*.sass    │                              │
└──────────────────────┴──────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   ONNX 模型     │
                    │   ResNet18      │
                    │   12 个类别     │
                    └─────────────────┘
```

## 项目结构

```
dissertation/
├── backend/                   # Go 后端
│   ├── app.go                 # 核心业务逻辑（接口、推理、数据库）
│   ├── types.go               # 数据结构定义
│   └── dbinit/                # 数据文件初始化（建表、品种数据、图片目录）
├── cmd/initdb/                # 构建后置钩子：准备 app.db 与图片目录
├── core/                      # Python 机器学习模块
│   ├── nets/                  # 网络结构定义
│   │   ├── resnet.py          # ResNet 基类
│   │   └── resnet18.py        # ResNet18 模型
│   ├── dataloader/            # 数据加载
│   ├── dataset/               # 数据集
│   ├── models/                # 训练权重与导出的 ONNX 模型
│   ├── train/                 # 训练脚本
│   │   ├── train_resnet18.py  # 模型训练
│   │   ├── train_resnet.py    # ResNet 训练
│   │   └── to_onnx.py         # PyTorch → ONNX 转换
│   ├── validate/              # 验证脚本
│   ├── test/                  # 测试脚本
│   └── const/                 # 超参数配置
├── frontend/                  # Preact + TypeScript 前端
│   └── src/
│       ├── components/        # 组件
│       │   ├── Main.tsx       # 主页面（上传 / 识别）
│       │   ├── History.tsx    # 历史记录页
│       │   ├── Modal.tsx      # 弹窗
│       │   ├── Navbar.tsx     # 导航栏
│       │   └── Pagination.tsx # 分页组件
│       ├── pages/app.tsx      # 路由入口
│       ├── styles/            # SASS 样式
│       └── utils/toast.ts     # 轻提示
├── static/images/             # 上传图片存放目录
├── build/bin/                 # 构建产物（exe、onnxruntime.dll、模型）
└── app.db                     # SQLite 数据库
```

## 快速开始

### 环境要求

- Go 1.21+
- Node.js 18+
- Python 3.9+（仅重新训练模型时需要）
- Wails CLI

### 安装依赖

```bash
# 安装 Wails CLI
go install github.com/wailsapp/wails/v2/cmd/wails@latest

# 安装前端依赖
cd frontend
npm install

# 回到项目根目录
cd ..
```

### 运行应用

```bash
# 开发模式（热更新）
wails dev

# 生产构建
wails build
```

### 重新训练模型（可选）

```bash
cd core/train

# 训练 ResNet18
python train_resnet18.py

# 导出为 ONNX 格式
python to_onnx.py
```

导出的模型文件 `resnet18_epoch_50.onnx` 需要放置到 `build/bin` 目录（后端按可执行文件所在目录加载模型与 `onnxruntime.dll`）。

## 技术细节

### 推理流程

1. **图像预处理** —— 将上传图片缩放到 224×224，并做 ImageNet 标准化
   - 均值 Mean：`[0.485, 0.456, 0.406]`
   - 标准差 Std：`[0.229, 0.224, 0.225]`
2. **张量格式** —— 转换为 NCHW 格式 `(1, 3, 224, 224)`
3. **ONNX 推理** —— 通过 ONNX Runtime 的 Go 绑定执行推理
4. **后处理** —— Softmax 计算置信度，取概率最大的类别作为识别结果

### 数据表

| 表名 | 说明 |
|------|------|
| `breeds` | 猫咪品种表（编号 code、名称 name、简介 brief） |
| `history` | 识别历史（图片、品种、置信度、时间戳） |

### 数据存放位置

后端在启动时会确定一个「应用数据目录」，`app.db` 与 `static/images` 始终位于同一目录下：

- **开发模式**（`wails dev`，工作目录为项目根）→ 数据位于项目根目录，即 `app.db` 与 `static/images/`
- **打包后的应用**（工作目录中不是项目根目录）→ 数据位于可执行文件所在目录，整个 bin 目录可直接分发运行

> 注意：早期版本的数据库路径与图片路径不一致（数据库在 `build/bin/app.db`，图片在根目录 `static/images`），会导致「清空历史」作用到了另一个库。若遇到旧数据残留，可直接删除多余的 `build/bin/app.db`。

### 构建时自动准备数据文件

`wails build` 会通过 `wails.json` 中的后置钩子自动执行 `cmd/initdb`，在 bin 目录中准备好运行所需的数据文件：

```
build/bin/
├── dissertation.exe        # 主程序
├── app.db                  # SQLite 数据库（breeds / history 表 + 品种基础数据）
├── static/images/          # 上传图片存放目录
├── resnet18_epoch_50.onnx # ONNX 模型
└── onnxruntime.dll         # ONNX Runtime 动态库
```

相关代码：

| 文件 | 作用 |
|------|------|
| `backend/dbinit/dbinit.go` | 建表、写入品种基础数据、创建图片目录（后端启动时也会调用一次自检） |
| `cmd/initdb/main.go` | 命令行入口，由 `wails build` 的 `postBuildHooks` 触发 |

手动执行（输出到指定目录）：

```bash
go run ./cmd/initdb -out build/bin
```

常用参数：

- `-out` —— 输出目录，默认 `<项目根目录>/build/bin`
- `-copy-runtime` —— 是否复制 ONNX 模型与 `onnxruntime.dll`（默认开启，已存在则跳过）

## 界面预览

### 主页面
- 支持拖拽的上传区域
- 实时图片预览
- 一键识别品种
- 置信度进度条展示结果

### 历史记录页
- 分页展示历史记录
- 点击图片查看详情
- 支持删除单条 / 清空全部

## 许可协议

MIT
