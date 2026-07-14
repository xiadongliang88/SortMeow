import { route } from "preact-router"

const Dashboard = () => {
    return (
        <div class="app-dashboard">
            <div class="dashboard-sidebar">
                <a href="/dashboard/datasets" onClick={(e) => { e.preventDefault(); route("/dashboard/datasets") }}>训练集管理</a>
                <a href="/dashboard/testsets" onClick={(e) => { e.preventDefault(); route("/dashboard/testsets") }}>测试集管理</a>
                <a href="/dashboard/logs" onClick={(e) => { e.preventDefault(); route("/dashboard/logs") }}>训练日志</a>
            </div>
            <div class="dashboard-content">
                {/* 子页面内容通过 Router 渲染到这里 */}
            </div>
        </div>
    )
}

export default Dashboard