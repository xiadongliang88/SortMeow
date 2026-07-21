import { useState, useEffect } from 'preact/hooks'
import { message } from '../utils/toast'
import Pagination from './Pagination'

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })
}

interface IHistoryItem {
    id: number
    img: string
    breed: number
    date: number
    name: string
    brief: string
}

const History = () => {
    const [page, setPage] = useState<number>(1)
    const pageSize = 5
    const [total, setTotal] = useState<number>(50)
    const [historyList, setHistoryList] = useState<IHistoryItem[]>([])

    useEffect(() => {
        if (!(window as any).go?.main?.App?.GetHistory) {
            message.error('Wails runtime not ready')
            return
        }
        fetchData(page)
    }, [])

    const fetchData = async(page: number) => {
        const result = await (window as any).go.main.App.GetHistory(page, pageSize)
        if (result.code === 0) {
            setHistoryList(result.data.list)
            setTotal(result.data.total)
        } else if (result.code === 1) {
            message.error(result.message)
        }
    }

    const handlePageChange = (page: number) => {
        setPage(page)
        fetchData(page)
    }

    const handleDelete = async(id: number) => {
        const result = await (window as any).go.main.App.DeleteOneHistory(id)
        if (result.code === 0) {
            message.success('删除成功')
            fetchData(page)
        } else if (result.code === 1) {
            message.error(result.message)
        }
    }

    return (
        <div class="app-history">
            <div class="history-clear">
                <a>清除全部</a>
            </div>
            {historyList.map((item: IHistoryItem) =>
                <div key={item.id} class="history-card">
                    <div class="card-left">
                        <img src="../assets/images/0012.jpg" />
                    </div>
                    <div class="card-right">
                        <div class="right-top">
                            <h3>{item.name}</h3>
                            <div class="card-actions">
                                <span>{formatDate(item.date)}</span>
                                <button onClick={() => handleDelete(item.id)} title="删除">
                                    ×
                                </button>
                            </div>
                        </div>
                        <div class="right-overview">
                            {item.brief}
                        </div>
                    </div>
                </div>)
            }
            <div class="history-pagination">
                <Pagination page={page} pagesize={pageSize} total={total} onChange={handlePageChange} />
            </div>
        </div>
    )
}

export default History