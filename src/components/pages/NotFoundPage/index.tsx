import { useLocation } from "react-router"
import ButtonLink from "../../atoms/ButtonLink"
import styles from "./styles.module.css"

export default function NotFoundPage() {
    const { pathname } = useLocation()

    return (
        <section className={styles.page}>
            <p className={styles.code}>404</p>
            <h1 className={styles.title}>Halaman tidak ditemukan</h1>
            <p className={styles.text}>
                Alamat <code className={styles.path}>{pathname}</code> tidak ada
                di aplikasi ini.
            </p>
            <div className={styles.actions}>
                <ButtonLink to="/">Kembali ke Dashboard</ButtonLink>
                <ButtonLink to="/products" variant="secondary">
                    Lihat daftar produk
                </ButtonLink>
            </div>
        </section>
    )
}
