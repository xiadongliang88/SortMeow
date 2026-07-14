const Main = () => {
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
                <div class="upload">
                    <div
                        id="dropZone"
                        class="upload-zone"
                    >
                        <div id="uploadContent">
                            <svg class="w-16 h-16 mx-auto mb-4 text-secondary animate-pulse-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                            </svg>
                            <p class="font-heading font-semibold text-xl text-text mb-2">点击或拖拽上传</p>
                            <p class="text-sm text-text/50">支持JPG、PNG、JPEG，最大不超过2MB</p>
                        </div>
                        {/* <div id="previewContent" class="hidden">
                            <img id="previewImage" class="max-h-64 mx-auto rounded-2xl mb-4 object-cover" alt="Cat preview" />
                            <button id="removeBtn" class="text-red-500 hover:text-red-600 font-medium transition-colors duration-200 cursor-pointer">
                                Remove photo
                            </button>
                        </div>
                        <input type="file" id="fileInput" class="hidden" accept="image/*" /> */}
                    </div>

                    {/* <button
                        id="detectBtn"
                        class="hidden w-full mt-4 bg-cta hover:bg-orange-600 text-white font-heading font-semibold text-lg py-4 rounded-2xl transition-colors duration-200 cursor-pointer flex items-center justify-center gap-3"
                    >
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                    </svg>
                    Detect Breed
                    </button> */}
                </div>

                {/* <div id="loadingState" class="hidden max-w-2xl mx-auto mb-12">
                    <div class="bg-white rounded-3xl border border-border p-8 text-center">
                    <div class="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p class="font-heading font-semibold text-lg text-text mb-2">Analyzing your cat...</p>
                    <p class="text-text/60">Our AI is identifying the breed</p>
                    </div>
                </div> */}

                {/* <div id="resultsSection" class="hidden">
                    <div class="flex items-center justify-center gap-3 mb-6">
                    <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <h2 class="font-heading font-bold text-2xl text-text">Detection Complete!</h2>
                    </div>

                    <div id="primaryResult" class="bg-white rounded-3xl border border-border p-6 md:p-8 mb-6">
                    <div class="flex flex-col md:flex-row gap-6 md:gap-8">
                        <div class="flex-shrink-0">
                        <img id="resultImage" class="w-full md:w-48 h-48 rounded-2xl object-cover" alt="Cat photo" />
                        </div>
                        <div class="flex-grow">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                            <h3 id="breedName" class="font-heading font-bold text-2xl md:text-3xl text-text mb-1"></h3>
                            <p id="scientificName" class="text-text/60 font-medium"></p>
                            </div>
                            <div class="bg-primary/10 px-4 py-2 rounded-xl">
                            <p class="font-heading font-bold text-xl text-primary"><span id="confidence">0</span>%</p>
                            <p class="text-xs text-text/60">confidence</p>
                            </div>
                        </div>

                        <div class="mb-4">
                            <div class="h-3 bg-border rounded-full overflow-hidden">
                            <div id="confidenceBar" class="confidence-bar h-full bg-gradient-to-r from-primary to-secondary rounded-full" style="width: 0%"></div>
                            </div>
                        </div>

                        <p id="breedDescription" class="text-text/80 leading-relaxed mb-4"></p>

                        <div id="breedTraits" class="flex flex-wrap gap-2">
                        </div>
                        </div>
                    </div>
                    </div>

                    <div class="mb-6">
                    <h4 class="font-heading font-semibold text-lg text-text mb-4">Other possibilities</h4>
                    <div id="otherResults" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    </div>
                    </div>

                    <div class="text-center">
                    <button
                        id="tryAgainBtn"
                        class="bg-primary hover:bg-blue-600 text-white font-heading font-semibold px-8 py-3 rounded-2xl transition-colors duration-200 cursor-pointer"
                    >
                        Try Another Photo
                    </button>
                    </div>
                </div> */}

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