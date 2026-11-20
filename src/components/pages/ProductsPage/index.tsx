import { useState } from "react"
import type { Product, ProductValues } from "../../../types/product"
import useProducts from "../../../context/useProducts"
import Button from "../../atoms/Button"
import ProductGrid from "../../organisms/ProductGrid"
import ProductFormModal from "../../organisms/ProductFormModal"
import ConfirmDeleteModal from "../../organisms/ConfirmDeleteModal"
import styles from "./styles.module.css"

type FormTarget = { mode: "create" } | { mode: "edit"; product: Product }

export default function ProductsPage() {
    const {
        products,
        status,
        error,
        displayMode,
        reload,
        addProduct,
        editProduct,
        removeProduct,
    } = useProducts()
    const [query, setQuery] = useState("")
    const [formTarget, setFormTarget] = useState<FormTarget | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
    const [notice, setNotice] = useState("")

    const keyword = query.trim().toLowerCase()
    const visibleProducts = keyword
        ? products.filter((product) =>
              product.name.toLowerCase().includes(keyword),
          )
        : products

    async function handleSubmit(values: ProductValues) {
        if (formTarget?.mode === "edit") {
            await editProduct(formTarget.product.id, values)
            setNotice(`Produk "${values.name}" berhasil diperbarui.`)
        } else {
            await addProduct(values)
            setNotice(`Produk "${values.name}" berhasil ditambahkan.`)
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return
        await removeProduct(deleteTarget.id)
        setNotice(`Produk "${deleteTarget.name}" berhasil dihapus.`)
    }

    return (
        <section className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Daftar Produk</h1>
                <Button onClick={() => setFormTarget({ mode: "create" })}>
                    Tambah produk
                </Button>
            </div>

            <input
                type="search"
                className={styles.search}
                placeholder="Cari nama produk"
                aria-label="Cari nama produk"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />

            {notice && (
                <p role="status" className={styles.notice}>
                    {notice}
                </p>
            )}

            {status === "loading" && (
                <p className={styles.message}>Memuat produk…</p>
            )}

            {status === "error" && (
                <div role="alert" className={styles.message}>
                    <p>{error}</p>
                    <Button variant="secondary" onClick={reload}>
                        Coba lagi
                    </Button>
                </div>
            )}

            {status === "ready" && products.length === 0 && (
                <p className={styles.message}>
                    Belum ada produk. Tambahkan produk pertama.
                </p>
            )}

            {status === "ready" &&
                products.length > 0 &&
                visibleProducts.length === 0 && (
                    <p className={styles.message}>
                        Tidak ada produk yang cocok dengan "{query.trim()}".
                    </p>
                )}

            {status === "ready" && visibleProducts.length > 0 && (
                <ProductGrid
                    products={visibleProducts}
                    layout={displayMode}
                    onEdit={(product) =>
                        setFormTarget({ mode: "edit", product })
                    }
                    onDelete={setDeleteTarget}
                />
            )}

            {formTarget && (
                <ProductFormModal
                    key={
                        formTarget.mode === "edit"
                            ? formTarget.product.id
                            : "create"
                    }
                    product={
                        formTarget.mode === "edit"
                            ? formTarget.product
                            : undefined
                    }
                    onSubmit={handleSubmit}
                    onClose={() => setFormTarget(null)}
                />
            )}

            {deleteTarget && (
                <ConfirmDeleteModal
                    product={deleteTarget}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteTarget(null)}
                />
            )}
        </section>
    )
}
