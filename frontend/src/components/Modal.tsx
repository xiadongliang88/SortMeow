import type { ModalProps } from '../preact'

const Modal = ({ open, title, onClick, onClose, children }: ModalProps) => {
    const handleClose = () => {
        onClose?.()
    }

    const handleConfirm = () => {
        onClick?.()
        handleClose()
    }

    const handleMaskClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose()
        }
    }

    return (
        <>
            {open ? 
                <>
                    <div class="app-modal" onClick={handleMaskClick}>
                        <div class="title">
                            <h3>{title}</h3>
                            <span onClick={handleClose}>×</span>
                        </div>
                        {children}
                        <div class="bottom">
                            <button onClick={handleClose}>取消</button>
                            <button onClick={handleConfirm}>确定</button>
                        </div>
                    </div>
                    <div class="app-mask" onClick={handleMaskClick}></div>
                </> : null
            }
        </>
    )
}

export default Modal