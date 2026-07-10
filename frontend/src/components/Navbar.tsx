export const Navbar = () => {
    return (
        <nav class="fixed top-4 left-4 right-4 z-50 animate-fade-in">
            <div class="max-w-6xl mx-auto bg-white backdrop-blur-md rounded-2xl shadow-lg border border-border px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3 cursor-pointer">
                        <svg class="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4.5 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm9 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-9.5 3.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm11 0c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zM12 18c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z"/>
                        </svg>
                        <span class="font-heading font-semibold text-xl text-text">MeowVision</span>
                    </div>
                    <div class="flex items-center gap-6">
                        <a href="#" class="text-text/70 hover:text-primary transition-colors duration-200 font-medium cursor-pointer">数据集</a>
                        <a href="#" class="text-text/70 hover:text-primary transition-colors duration-200 font-medium cursor-pointer">历史记录</a>
                        <button class="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors duration-200 cursor-pointer">
                            代码仓库
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}