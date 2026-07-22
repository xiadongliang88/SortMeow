export interface HistoryItem {
    id: number
    img: string
    breed: number
    date: number
    name: string
    brief: string
}

export interface DetectResult {
    id: number
    code: string
    name: number
    brief: string
    confidence_level: number
}

export interface PaginationProps {
    total: number
    onChange: (page: number) => void
    page: number
    pagesize: number
}

interface ModalProps {
    open: boolean
    title: string
    onClick?: () => void
    onClose?: () => void
    children?: preact.ComponentChildren
}