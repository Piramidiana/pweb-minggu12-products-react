import { useEffect, useState, type ReactNode } from "react"
import { useParams } from "react-router"
import { productRepository } from "../../../data/product"
import { ProductApiError } from "../../../data/product/source/product-remote.ts"
import type { Product } from "../../../types/product"
import { formatRupiah } from "../../../utils/formatRupiah"
import ButtonLink from "../../atoms/ButtonLink"
import styles from "./styles.module.css"

type DetailState =
    | { status: "loading" }
    | { status: "ready"; product: Product }
    | { status: "not-found" }
    | { status: "error"; message: string }

function DetailFrame({ children }: { children: ReactNode }) {
    return (
        <section className={styles.page}>
            <ButtonLink
                to="/products"
                variant="secondary"
                className={styles.back}
            >
                ← Kembali ke daftar produk
            </ButtonLink>
            {children}
        </section>
    )
}

function NotFoundMessage({ id }: { id: string }) {
    return (
        <p role="alert" className={styles.message}>
            Produk dengan ID {id} tidak ditemukan.
        </p>
    )
}

function ProductDetail({ id }: { id: number }) {
    const [state, setState] = useState<DetailState>({ status: "loading" })

    useEffect(() => {
        let ignore = false

        productRepository
            .getProduct(id)
            .then((model) => {
                if (ignore) return
                setState({ status: "ready", product: model.toJSON() })
            })
            .catch((reason: unknown) => {
                if (ignore) return
                if (
                    reason instanceof ProductApiError &&
                    reason.status === 404
                ) {
                    setState({ status: "not-found" })
                    return
                }
                setState({
                    status: "error",
                    message:
                        reason instanceof Error
                            ? reason.message
                            : "Gagal memuat produk.",
                })
            })

        return () => {
            ignore = true
        }
    }, [id])

    return (
        <DetailFrame>
            {state.status === "loading" && (
                <p role="status" className={styles.message}>
                    Memuat produk…
                </p>
            )}
            {state.status === "not-found" && (
                <NotFoundMessage id={String(id)} />
            )}
            {state.status === "error" && (
                <p role="alert" className={styles.error}>
                    {state.message}
                </p>
            )}
            {state.status === "ready" && (
                <article className={styles.card}>
                    <h1 className={styles.title}>{state.product.name}</h1>
                    <dl className={styles.list}>
                        <div>
                            <dt className={styles.label}>ID</dt>
                            <dd className={styles.value}>{state.product.id}</dd>
                        </div>
                        <div>
                            <dt className={styles.label}>Harga</dt>
                            <dd className={`${styles.value} ${styles.price}`}>
                                {formatRupiah(state.product.price)}
                            </dd>
                        </div>
                    </dl>
                </article>
            )}
        </DetailFrame>
    )
}

export default function ProductDetailPage() {
    const { id = "" } = useParams()
    const productId = Number(id)

    if (!Number.isSafeInteger(productId) || productId <= 0) {
        return (
            <DetailFrame>
                <NotFoundMessage id={id} />
            </DetailFrame>
        )
    }

    return <ProductDetail key={productId} id={productId} />
}
