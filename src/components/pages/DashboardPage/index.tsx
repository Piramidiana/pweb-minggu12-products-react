import useProducts from "../../../context/useProducts"
import { formatRupiah } from "../../../utils/formatRupiah"
import Button from "../../atoms/Button"
import ButtonLink from "../../atoms/ButtonLink"
import styles from "./styles.module.css"

export default function DashboardPage() {
    const { products, status, error, displayMode, reload } = useProducts()

    const highestPrice = products.reduce(
        (highest, product) => Math.max(highest, product.price),
        0,
    )

    return (
        <section className={styles.page}>
            <h1 className={styles.title}>Dashboard</h1>

            {status === "loading" && (
                <p className={styles.message}>Memuat ringkasan…</p>
            )}

            {status === "error" && (
                <div role="alert" className={styles.message}>
                    <p>{error}</p>
                    <Button variant="secondary" onClick={reload}>
                        Coba lagi
                    </Button>
                </div>
            )}

            {status === "ready" && (
                <dl className={styles.stats}>
                    <div className={styles.card}>
                        <dt className={styles.label}>Total produk</dt>
                        <dd className={styles.value}>{products.length}</dd>
                    </div>
                    <div className={styles.card}>
                        <dt className={styles.label}>Harga tertinggi</dt>
                        <dd className={styles.value}>
                            {products.length > 0
                                ? formatRupiah(highestPrice)
                                : "-"}
                        </dd>
                    </div>
                    <div className={styles.card}>
                        <dt className={styles.label}>Tampilan produk</dt>
                        <dd className={styles.value}>
                            {displayMode === "grid" ? "Grid" : "List"}
                        </dd>
                    </div>
                </dl>
            )}

            <div className={styles.actions}>
                <ButtonLink to="/products">Kelola produk</ButtonLink>
                <ButtonLink to="/settings" variant="secondary">
                    Pengaturan
                </ButtonLink>
            </div>
        </section>
    )
}
