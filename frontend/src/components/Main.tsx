import { useState, useRef } from 'preact/hooks'
import type { DetectResult } from '../preact'
import { message } from '../utils/toast'


const Main = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [fileSrc, setFileSrc] = useState<string>('')
    const [filename, setFilename] = useState<string>('')
    const [step, setStep] = useState<number>(0)
    const [detectResult, setDetectResult] = useState<DetectResult | null>(null)

    const handleUploadClick = () => fileInputRef.current?.click()

    function loadImage(file: File): Promise<HTMLImageElement> {
        return new Promise((resolve) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.src = URL.createObjectURL(file)
        })
    }

    const resizeImage = async(file: File, maxWidth = 224): Promise<File> => {
        const img = await loadImage(file)
        if (img.width <= maxWidth) {
            return file
        }

        const canvas = document.createElement('canvas')
        const ratio = maxWidth / img.width
        canvas.width = maxWidth
        canvas.height = Math.round(img.height * ratio)

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        return new Promise((resolve) => {
            canvas.toBlob((blob: Blob | null) => {
                if (!blob) {
                    resolve(file)
                    return
                }
                resolve(new File([blob], file.name, { type: file.type }))
            }, file.type, 0.9)
        })
    }

    const handleFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]
        if (file) {
            console.log('文件大小:', file.size / 1024)

            const reader = new FileReader()
            reader.onload = async function() {
                const processedFile = await resizeImage(file, 224)

                const arrayBuffer = await processedFile.arrayBuffer()
                const uint8Array = new Uint8Array(arrayBuffer)

                const result = await (window as any).go.backend.App.UploadImage(
                    Array.from(uint8Array),
                    file.name
                )
                if (result.code === 0) {
                    setFileSrc(result.data.data)
                    setFilename(result.data.filename)
                    setStep(1)
                } else if (result.code === 1) {
                    message.error(result.message)
                }
            }
            reader.readAsArrayBuffer(file)
        }
    }

    const resetUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        setFileSrc('')
    }

    const handleRemovePhoto = (e: Event) => {
        e.stopPropagation()
        setStep(0)
        resetUpload()
    }

    const handleDetect = () => {
        setStep(2)

        setTimeout(async() => {
            if (filename) {
                const result = await (window as any).go.backend.App.Detect(filename)
                if (result.code === 0) {
                    setDetectResult(result.data)
                    setStep(3)
                } else if (result.code === 1) {
                    message.error(result.message)
                }
            }
        }, 500)
    }

    const handleTryOther = () => {
        setStep(0)
        setDetectResult(null)
        resetUpload()
    }

    return (
        <main class="app-main">
            <div class="main-container">
                <div class="title">
                    <h1>
                        发现<span>它</span>的<span>分类</span>
                    </h1>
                    <p>
                        上传一张猫咪照片，让AI认出它<span>是什么</span>
                    </p>
                    <i>
                        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                        <span>基于深度残差网络</span>
                    </i>
                </div>
                <div class={`upload${!(step == 0 || step == 1 || step == 2) ? ' hidden' : ''}`}>
                    <div 
                        class="upload-zone" 
                        style={{borderStyle: step != 2 ? 'dashed' : 'solid'}} 
                        onClick={handleUploadClick}
                    >
                        {fileSrc.length > 0 && step == 1 ?
                            <div id="previewContent">
                                <img src={`data:image/jpeg;base64,${fileSrc}`} />
                                <button onClick={handleRemovePhoto}>
                                    ❌ 移除照片
                                </button>
                            </div> : null
                        }
                        {fileSrc.length == 0 && step == 0 ?
                            <>
                                <div id="uploadContent">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path 
                                            stroke-linecap="round" 
                                            stroke-linejoin="round" 
                                            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                        />
                                    </svg>
                                    <p>点击或拖拽上传</p>
                                    <p>支持JPG、PNG、JPEG，最大不超过2MB</p>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    class="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </> : null
                        }
                        {fileSrc.length > 0 && step == 2 ?
                            <>
                                <div class="zone-loading">
                                    <div class="loading-spinner" />
                                    <p>正在检测...</p>
                                    <p>请耐心等待~</p>
                                </div>
                            </> : null
                        }
                    </div>
                    {fileSrc.length > 0 && step == 1 ?
                        <button onClick={handleDetect}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path 
                                    stroke-linecap="round" 
                                    stroke-linejoin="round" 
                                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                />
                            </svg>
                            开始检测
                        </button> : null
                    }
                </div>
                <div class={`result${step != 3 ? ' hidden' : ''}`}>
                    <div class="result-complete">
                        <svg viewBox="0 0 24 24" fill="#00b740ff">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <h2>完成！</h2>
                    </div>
                    <div class="result-main">
                        <img src={`data:image/jpeg;base64,${fileSrc}`} />
                        <div class="result-word">
                            <div>
                                <h3>{detectResult?.name}</h3>
                                <div>
                                    <div class="probability-bar">
                                        <div />
                                    </div>
                                    <span>置信度 {detectResult ? (detectResult.confidence_level * 100).toFixed(2) + '%' : ''}</span>
                                </div>
                            </div>
                            <p>{detectResult?.brief}</p>
                        </div>
                    </div>
                    <button onClick={handleTryOther}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        再试一张
                    </button>
                </div>
            </div>
        </main>
    )
}

export default Main