import { useEffect, useState, type ReactNode } from "react"
import { productRepository } from "../data/product"
import type { Product, ProductValues } from "../types/product"
import {
    ProductsContext,
    type DisplayMode,
    type LoadStatus,
} from "./products-context"

type ProductsProviderProps = {
    children: ReactNode
}

export default function ProductsProvider({ children }: ProductsProviderProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [status, setStatus] = useState<LoadStatus>("loading")
    const [error, setError] = useState("")
    const [displayMode, setDisplayMode] = useState<DisplayMode>("grid")
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        let ignore = false

        productRepository
            .getProductList()
            .then((models) => {
                if (ignore) return
                setProducts(models.map((model) => model.toJSON()))
                setStatus("ready")
            })
            .catch((reason: unknown) => {
                if (ignore) return
                setError(
                    reason instanceof Error
                        ? reason.message
                        : "Gagal memuat produk.",
                )
                setStatus("error")
            })

        return () => {
            ignore = true
        }
    }, [reloadKey])

    function reload() {
        setStatus("loading")
        setError("")
        setReloadKey((key) => key + 1)
    }

    async function addProduct(values: ProductValues) {
        const created = await productRepository.createProduct(values)
        setProducts((current) => [...current, created.toJSON()])
    }

    async function editProduct(id: number, values: ProductValues) {
        const updated = await productRepository.updateProduct(id, values)
        setProducts((current) =>
            current.map((product) =>
                product.id === id ? updated.toJSON() : product,
            ),
        )
    }

    async function removeProduct(id: number) {
        await productRepository.deleteProduct(id)
        setProducts((current) => current.filter((product) => product.id !== id))
    }

    return (
        <ProductsContext
            value={{
                products,
                status,
                error,
                displayMode,
                setDisplayMode,
                reload,
                addProduct,
                editProduct,
                removeProduct,
            }}
        >
            {children}
        </ProductsContext>
    )
}
