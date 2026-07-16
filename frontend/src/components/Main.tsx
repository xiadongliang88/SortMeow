import { useState, useEffect, useRef } from 'preact/hooks'


const Main = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [fileName, setFileName] = useState<string>('')
    const [fileSrc, setFileSrc] = useState<string>('')

    const [step, setStep] = useState(0)

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = async function() {
                const arrayBuffer = reader.result as ArrayBuffer
                const uint8Array = new Uint8Array(arrayBuffer)

                const result = await (window as any).go.main.App.UploadImage(
                    Array.from(uint8Array),
                    file.name
                )

                if (result.code === 0) {
                    setFileName(result.data)

                    const imgResult = await (window as any).go.main.App.GetImage(result.data)
                    if (imgResult.code === 0) {
                        setFileSrc(imgResult.data)
                        setStep(1)
                    }
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

        setTimeout(() => {
            setStep(3)
        }, 1000)
    }

    const handleTryOther = () => {
        setStep(0)
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
                        上传一张猫咪照片，让AI不仅认出它<span>是什么</span>
                    </p>
                    <i>基于深度残差网络</i>
                </div>
                <div class={`upload${!(step == 0 || step == 1 || step == 2) ? ' hidden' : ''}`}>
                    <div 
                        class="upload-zone" 
                        style={{borderStyle: step != 2 ? 'dashed' : 'solid'}} 
                        onClick={handleUploadClick}
                    >
                        {fileSrc.length > 0 && step == 1 ?
                            <div id="previewContent">
                                <img src={fileSrc} id="previewImage" />
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
                        <button id="detectBtn" onClick={handleDetect}>
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
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <h2>检测完成！</h2>
                    </div>
                    <div class="result-main">
                        <img />
                        <div class="result-word">
                            <div>
                                <h3>异国短毛猫</h3>
                                <div>
                                    <div class="probability-bar">
                                        <div />
                                    </div>
                                    <span>可信度 78%</span>
                                </div>
                            </div>
                            <h4>关于英短</h4>
                            <p>尽量快点附近的路口附近的联发科九点零分肌肤的路口附近登陆反对浪费空间 尽量快点附近的路口附近的联发科九点零分肌肤的路口附近登陆反对浪费空间</p>
                        </div>
                    </div>
                    <button onClick={handleTryOther}>
                        再试一张
                    </button>
                </div>

                {/* <div id="featuresSection" class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    <div class="bg-white rounded-2xl border border-border p-6 text-center cursor-pointer hover:shadow-lg transition-shadow duration-200">
                    <div class="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <svg class="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                    </div>
                    <h3 class="font-heading font-semibold text-lg text-text mb-2">Lightning Fast</h3>
                    <p class="text-text/60 text-sm">Get results in under 3 seconds with our optimized AI model</p>
                    </div>

                    <div class="bg-white rounded-2xl border border-border p-6 text-center cursor-pointer hover:shadow-lg transition-shadow duration-200">
                    <div class="w-14 h-14 mx-auto mb-4 bg-cta/10 rounded-2xl flex items-center justify-center">
                        <svg class="w-7 h-7 text-cta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                        </svg>
                    </div>
                    <h3 class="font-heading font-semibold text-lg text-text mb-2">98% Accuracy</h3>
                    <p class="text-text/60 text-sm">Trained on 50,000+ cat images across 60+ breeds</p>
                    </div>

                    <div class="bg-white rounded-2xl border border-border p-6 text-center cursor-pointer hover:shadow-lg transition-shadow duration-200">
                    <div class="w-14 h-14 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
                        <svg class="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                    </div>
                    <h3 class="font-heading font-semibold text-lg text-text mb-2">Always Free</h3>
                    <p class="text-text/60 text-sm">No hidden fees, no subscriptions. Detect away!</p>
                    </div>
                </div> */}
            </div>
        </main>
    )
}

export default Main