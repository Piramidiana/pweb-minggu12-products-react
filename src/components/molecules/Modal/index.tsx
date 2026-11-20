import { useEffect, useId, useRef, type ReactNode } from "react"
import styles from "./styles.module.css"

type ModalProps = {
    title: string
    onClose: () => void
    children: ReactNode
}

export default function Modal({ title, onClose, children }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const titleId = useId()

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        dialog.showModal()
        return () => dialog.close()
    }, [])

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            className={styles.dialog}
            onCancel={(event) => {
                event.preventDefault()
                onClose()
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
        >
            <div className={styles.panel}>
                <h2 id={titleId} className={styles.title}>
                    {title}
                </h2>
                {children}
            </div>
        </dialog>
    )
}
