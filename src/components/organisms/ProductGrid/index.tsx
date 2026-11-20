import type { Product } from "../../../types/product"
import type { DisplayMode } from "../../../context/products-context"
import ProductCard from "../../molecules/ProductCard"
import styles from "./styles.module.css"

type Props = {
    products: Product[]
    layout: DisplayMode
    onEdit: (product: Product) => void
    onDelete: (product: Product) => void
}

export default function ProductGrid({
    products,
    layout,
    onEdit,
    onDelete,
}: Props) {
    return (
        <div className={layout === "grid" ? styles.grid : styles.list}>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    layout={layout}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}
