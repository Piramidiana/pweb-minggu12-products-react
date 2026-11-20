import { useRef, useState, type FormEvent } from "react"
import type { Product, ProductValues } from "../../../types/product"
import {
    validateProductForm,
    type ProductFormErrors,
} from "../../../utils/validateProduct"
import Button from "../../atoms/Button"
import FormField from "../../molecules/FormField"
import Modal from "../../molecules/Modal"
import styles from "./styles.module.css"

type Props = {
    product?: Product
    onSubmit: (values: ProductValues) => Promise<void>
    onClose: () => void
}

export default function ProductFormModal({
    product,
    onSubmit,
    onClose,
}: Props) {
    const [name, setName] = useState(product?.name ?? "")
    const [price, setPrice] = useState(product ? String(product.price) : "")
    const [errors, setErrors] = useState<ProductFormErrors>({})
    const [submitError, setSubmitError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const nameRef = useRef<HTMLInputElement>(null)
    const priceRef = useRef<HTMLInputElement>(null)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const nextErrors = validateProductForm(name, price)
        setErrors(nextErrors)
        setSubmitError("")

        if (nextErrors.name) {
            nameRef.current?.focus()
            return
        }
        if (nextErrors.price) {
            priceRef.current?.focus()
            return
        }

        setIsSubmitting(true)
        try {
            await onSubmit({ name: name.trim(), price: Number(price.trim()) })
            onClose()
        } catch (reason) {
            setSubmitError(
                reason instanceof Error
                    ? reason.message
                    : "Gagal menyimpan produk.",
            )
            setIsSubmitting(false)
        }
    }

    function handleClose() {
        if (!isSubmitting) onClose()
    }

    return (
        <Modal
            title={product ? "Edit produk" : "Tambah produk"}
            onClose={handleClose}
        >
            <form onSubmit={handleSubmit} noValidate className={styles.form}>
                <FormField
                    label="Nama produk"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    error={errors.name}
                    inputRef={nameRef}
                    autoComplete="off"
                />
                <FormField
                    label="Harga (Rp)"
                    inputMode="numeric"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    error={errors.price}
                    inputRef={priceRef}
                    autoComplete="off"
                />
                {submitError && (
                    <p role="alert" className={styles.error}>
                        {submitError}
                    </p>
                )}
                <div className={styles.actions}>
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Menyimpan…" : "Simpan"}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
