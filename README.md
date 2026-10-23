# CatBreed - Cat Breed Recognition Desktop Application

A deep learning-based cat breed recognition desktop application built with Wails framework, supporting image upload, breed prediction, and history management.

[切换至中文](./README.zh-CN.md)

![Wails](https://img.shields.io/badge/Wails-Desktop%20App-blue)
![Preact](https://img.shields.io/badge/Preact-Frontend%20TS-green)
![Go](https://img.shields.io/badge/Go-Backend-blue)
![ONNX](https://img.shields.io/badge/ONNX-Inference-orange)

## Features

- **📸 Image Upload** - Drag & drop or click to upload cat photos (JPG/PNG/JPEG)
- **🔍 Breed Recognition** - Recognizes 12 common cat breeds based on ResNet18 deep residual network
- **📊 Confidence Display** - Shows model prediction confidence percentage
- **📜 History** - Auto-saves each recognition record with pagination support
- **🗑️ Record Management** - Delete individual records or clear all history
- **💾 Local Storage** - Uses SQLite database for history data

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Wails Framework                  │
├──────────────────────┬──────────────────────────────┤
│   Frontend (Preact) │      Backend (Go)             │
│   ─────────────────  │   ────────────────────────── │
│   • Main.tsx         │   • app.go (API)             │
│   • History.tsx      │   • types.go (Data Models)   │
│   • Modal.tsx        │   • ONNX Runtime Inference   │
│   • Component Logic  │   • GORM + SQLite            │
└──────────────────────┴──────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   ONNX Model    │
                    │   ResNet18      │
                    │   12 Classes    │
                    └─────────────────┘
```

## Project Structure

```
dissertation/
├── backend/                   # Go backend
│   ├── app.go                 # Core business logic (API, inference, database)
│   ├── types.go               # Data structure definitions
│   └── dbinit/                # Data file initialization (tables, breed data, image dir)
├── cmd/initdb/                # Post-build hook: prepares app.db and image dir
├── core/                      # Python ML module
│   ├── nets/                  # Neural network definitions
│   │   ├── resnet.py          # ResNet base class
│   │   └── resnet18.py        # ResNet18 model
│   ├── dataloader/            # Data loading
│   ├── dataset/               # Datasets
│   ├── models/                # Training weights and exported ONNX models
│   ├── train/                 # Training scripts
│   │   ├── train_resnet18.py  # ResNet18 training
│   │   ├── train_resnet.py    # ResNet training
│   │   └── to_onnx.py         # PyTorch → ONNX conversion
│   ├── validate/              # Validation scripts
│   ├── test/                  # Test scripts
│   └── const/                 # Hyperparameter configuration
├── frontend/                  # Preact + TypeScript frontend
│   └── src/
│       ├── components/        # Components
│       │   ├── Main.tsx       # Main page (upload/recognition)
│       │   ├── History.tsx    # History page
│       │   ├── Modal.tsx      # Modal dialog
│       │   ├── Navbar.tsx     # Navigation bar
│       │   └── Pagination.tsx # Pagination component
│       ├── pages/app.tsx      # Router entry
│       ├── styles/            # SASS styles
│       └── utils/toast.ts     # Toast notifications
├── static/images/             # Uploaded image storage directory
├── build/bin/                 # Build output (exe, onnxruntime.dll, model)
└── app.db                     # SQLite database
```

## Quick Start

### Requirements

- Go 1.21+
- Node.js 18+
- Python 3.9+ (for model training)
- Wails CLI

### Install Dependencies

```bash
# Install Wails CLI
go install github.com/wailsapp/wails/v2/cmd/wails@latest

# Install frontend dependencies
cd frontend
npm install

# Return to project root
cd ..
```

### Run the Application

```bash
# Development mode
wails dev

# Production build
wails build
```

### Model Training (Optional)

To retrain the model:

```bash
cd core/train

# Train ResNet18
python train_resnet18.py

# Export to ONNX format
python to_onnx.py
```

The trained model file `resnet18_epoch_50.onnx` should be placed in the `build/bin` directory of the output.

## Technical Details

### Inference Pipeline

1. **Image Preprocessing** - Resize uploaded image to 224×224, apply ImageNet normalization
   - Mean: `[0.485, 0.456, 0.406]`
   - Std: `[0.229, 0.224, 0.225]`
2. **Tensor Format** - Convert to NCHW format `(1, 3, 224, 224)`
3. **ONNX Inference** - Execute inference via ONNX Runtime Go
4. **Post-processing** - Softmax for confidence calculation, return highest probability class

### Data Models

| Table | Description |
|-------|-------------|
| `breeds` | Cat breed table (code, name, brief description) |
| `history` | Recognition history (image, breed, confidence, timestamp) |

### Data Location

The backend resolves a single "app data directory" at startup; `app.db` and `static/images` always live in the same place:

- **Development** (`wails dev`, working directory = project root) → data lives in the project root (`app.db`, `static/images/`)
- **Packaged app** (working directory is not the project root) → data lives next to the executable, so the whole bin folder is portable

### Automatic Data Preparation on Build

`wails build` runs `cmd/initdb` through the `postBuildHooks` hook in `wails.json`, preparing everything the app needs in the bin directory:

```
build/bin/
├── dissertation.exe        # application binary
├── app.db                  # SQLite database (breeds / history tables + breed seed data)
├── static/images/          # uploaded image directory
├── resnet18_epoch_50.onnx # ONNX model
└── onnxruntime.dll         # ONNX Runtime shared library
```

| File | Purpose |
|------|---------|
| `backend/dbinit/dbinit.go` | Creates the tables, seeds the breed data and the image directory (also called on backend startup as a safety net) |
| `cmd/initdb/main.go` | CLI entry point, triggered by the `postBuildHooks` hook of `wails build` |

Run it manually:

```bash
go run ./cmd/initdb -out build/bin
```

Flags:

- `-out` —— output directory (default `<project root>/build/bin`)
- `-copy-runtime` —— also copy the ONNX model and `onnxruntime.dll` (enabled by default, skipped when they already exist)

## UI Preview

### Main Page
- Upload area supports drag & drop
- Real-time image preview
- One-click breed recognition
- Result display with confidence progress bar

### History Page
- Paginated history records
- Click image to view details
- Single/batch delete functionality

## License

MIT
