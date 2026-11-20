import { useState } from "react"
import type { Product } from "../../../types/product"
import Button from "../../atoms/Button"
import Modal from "../../molecules/Modal"
import styles from "./styles.module.css"

type Props = {
    product: Product
    onConfirm: () => Promise<void>
    onClose: () => void
}

export default function ConfirmDeleteModal({
    product,
    onConfirm,
    onClose,
}: Props) {
    const [error, setError] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleConfirm() {
        setIsDeleting(true)
        setError("")
        try {
            await onConfirm()
            onClose()
        } catch (reason) {
            setError(
                reason instanceof Error
                    ? reason.message
                    : "Gagal menghapus produk.",
            )
            setIsDeleting(false)
        }
    }

    function handleClose() {
        if (!isDeleting) onClose()
    }

    return (
        <Modal title="Hapus produk" onClose={handleClose}>
            <p className={styles.text}>
                Produk <strong className={styles.name}>{product.name}</strong>{" "}
                akan dihapus permanen. Lanjutkan?
            </p>
            {error && (
                <p role="alert" className={styles.error}>
                    {error}
                </p>
            )}
            <div className={styles.actions}>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isDeleting}
                >
                    Batal
                </Button>
                <Button
                    variant="danger"
                    onClick={handleConfirm}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Menghapus…" : "Hapus"}
                </Button>
            </div>
        </Modal>
    )
}
