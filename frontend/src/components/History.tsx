import { useState, useEffect } from 'preact/hooks'
import Pagination from './Pagination'
import Modal from './Modal'
import ImagePreview from './ImagePreview'
import { message } from '../utils/toast'
import type { HistoryItem } from '../preact'

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

const History = () => {
    const [page, setPage] = useState<number>(1)
    const pageSize = 5
    const [total, setTotal] = useState<number>(50)
    const [historyList, setHistoryList] = useState<HistoryItem[]>([])
    const [showDelete, setShowDelete] = useState<boolean>(false)
    const [currentId, setCurrentId] = useState<number | null>(null)
    const [showClear, setShowClear] = useState<boolean>(false)

    useEffect(() => {
        if (!(window as any).go?.backend?.App?.GetHistory) {
            message.error('Wails runtime not ready')
            return
        }
        fetchData(page)
    }, [])

    const fetchData = async(page: number) => {
        const result = await (window as any).go.backend.App.GetHistory(page, pageSize)
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

    const handleShowDelete = (id: number) => {
        setCurrentId(id)
        setShowDelete(true)
    }

    const handleDeleteOk = async() => {
        setShowDelete(false)
        if (!currentId) {
            message.error('currentId为空')
            return
        }
        const result = await (window as any).go.backend.App.DeleteOneHistory(currentId)
        if (result.code === 0) {
            message.success('删除成功')
            setCurrentId(null)
            fetchData(page)
        } else if (result.code === 1) {
            message.error(result.message)
        }
    }

    const handleDeleteClose = () => {
        setShowDelete(false)
        setCurrentId(null)
    }

    const handleShowModal = () => setShowClear(true)

    const handleClearOk = async() => {
        setShowClear(false)
        const result = await (window as any).go.backend.App.ClearHistory()
        if (result.code === 0) {
            message.success('已清空历史')
            setCurrentId(null)
            fetchData(page)
        } else if (result.code === 1) {
            message.error(result.message)
        }
    }

    const handleClearClose = () => setShowClear(false)

    return (
        <>
            <div class="app-history">
                <div class="history-clear">
                    <button onClick={handleShowModal} title="清空历史">
                        <svg class="icon" viewBox="0 0 24 24" fill="#616569ff" width="16" height="16">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                    </button>
                </div>
                {historyList.map((item: HistoryItem) =>
                    <div key={item.id} class="history-card">
                        <div class="card-left">
                            <ImagePreview filename={item.img} />
                        </div>
                        <div class="card-right">
                            <div class="right-top">
                                <h3>{item.name}</h3>
                                <div class="card-actions">
                                    <span>{formatDate(item.date)}</span>
                                    <button onClick={() => handleShowDelete(item.id)} title="删除">
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
                {historyList.length ? 
                    <div class="history-pagination">
                        <Pagination page={page} pagesize={pageSize} total={total} onChange={handlePageChange} />
                    </div> : null
                }
                {!historyList.length ?
                    <div class="history-none">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#c0c0c0" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"/>
                        </svg>
                        <p>暂无记录</p>
                    </div> : null
                }
            </div>
            <Modal open={showDelete} title="信息" onClick={handleDeleteOk} onClose={handleDeleteClose}>
                <p>确定要删除当前记录？</p>
            </Modal>
            <Modal open={showClear} title="信息" onClick={handleClearOk} onClose={handleClearClose}>
                <p>确定要删除全部记录？</p>
            </Modal>
        </>
    )
}

export default History