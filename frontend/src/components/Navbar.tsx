export const Navbar = () => {
    const svgPath = "M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4.5 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm9 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-9.5 3.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm11 0c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zM12 18c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z"

    const handleClick = () => window.open('https://git.leonstack.com/Leon/Collage-Images', '_blank')

    return (
        <nav class="app-navbar animate-fade-in">
            <div class="navbar-container">
                <div class="container-left">
                    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d={svgPath} />
                    </svg>
                    <span class="font-heading font-semibold text-xl text-text">分类miao</span>
                </div>
                <div class="container-right">
                    <a href="/">主页</a>
                    <a href="/history">历史记录</a>
                    <a href="/dashboard">后台管理</a>
                    <button onClick={handleClick}>代码仓库</button>
                </div>
            </div>
        </nav>
    )
}