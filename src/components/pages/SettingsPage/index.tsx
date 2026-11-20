import useProducts from "../../../context/useProducts"
import type { DisplayMode } from "../../../context/products-context"
import styles from "./styles.module.css"

const options: { value: DisplayMode; label: string; hint: string }[] = [
    {
        value: "grid",
        label: "Grid",
        hint: "Kartu produk tersusun dalam kolom.",
    },
    { value: "list", label: "List", hint: "Satu produk per baris." },
]

export default function SettingsPage() {
    const { displayMode, setDisplayMode } = useProducts()

    return (
        <section className={styles.page}>
            <h1 className={styles.title}>Pengaturan</h1>
            <fieldset className={styles.group}>
                <legend className={styles.legend}>
                    Tampilan daftar produk
                </legend>
                {options.map((option) => (
                    <label key={option.value} className={styles.option}>
                        <input
                            type="radio"
                            name="displayMode"
                            value={option.value}
                            checked={displayMode === option.value}
                            onChange={() => setDisplayMode(option.value)}
                        />
                        <span>
                            <span className={styles.label}>{option.label}</span>
                            <span className={styles.hint}>{option.hint}</span>
                        </span>
                    </label>
                ))}
            </fieldset>
            <p className={styles.note}>
                Pilihan ini dipakai oleh halaman Produk.
            </p>
        </section>
    )
}
