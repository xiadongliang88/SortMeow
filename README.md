# CatBreed - Cat Breed Recognition Desktop Application

A deep learning-based cat breed recognition desktop application built with Wails framework, supporting image upload, breed prediction, and history management.

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
│   ├── app.go                 # Core business logic
│   └── types.go               # Data structure definitions
├── core/                      # Python ML module
│   ├── nets/                  # Neural network definitions
│   │   ├── resnet.py          # ResNet base class
│   │   └── resnet18.py        # ResNet18 model
│   ├── dataloader/            # Data loading
│   ├── train/                 # Training scripts
│   │   ├── train_resnet18.py  # Model training
│   │   └── to_onnx.py         # PyTorch → ONNX conversion
│   └── const/                 # Hyperparameter configuration
├── frontend/                  # Preact + TypeScript frontend
│   └── src/
│       └── components/        # React-style components
│           ├── Main.tsx       # Main page (upload/recognition)
│           └── History.tsx    # History page
├── static/images/             # Uploaded image storage directory
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
