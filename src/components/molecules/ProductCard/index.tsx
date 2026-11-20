import type { Product } from "../../../types/product"
import type { DisplayMode } from "../../../context/products-context"
import { TbPackage } from "react-icons/tb"
import Button from "../../atoms/Button"
import ButtonLink from "../../atoms/ButtonLink"
import { formatRupiah } from "../../../utils/formatRupiah"
import styles from "./styles.module.css"

type Props = {
    product: Product
    layout: DisplayMode
    onEdit: (product: Product) => void
    onDelete: (product: Product) => void
}

export default function ProductCard({
    product,
    layout,
    onEdit,
    onDelete,
}: Props) {
    return (
        <article
            className={`${styles.card} ${layout === "list" ? styles.row : ""}`}
        >
            <div className={styles.header}>
                <span className={styles.id}>ID: {product.id}</span>
                <TbPackage className={styles.icon} aria-hidden="true" />
            </div>
            <div className={styles.body}>
                <h2 className={styles.name}>{product.name}</h2>
                <p className={styles.price}>{formatRupiah(product.price)}</p>
            </div>
            <div className={styles.actions}>
                <ButtonLink
                    to={`/products/${product.id}`}
                    variant="secondary"
                >
                    Detail
                </ButtonLink>
                <Button variant="secondary" onClick={() => onEdit(product)}>
                    Edit
                </Button>
                <Button
                    variant="subtleDanger"
                    onClick={() => onDelete(product)}
                >
                    Hapus
                </Button>
            </div>
        </article>
    )
}