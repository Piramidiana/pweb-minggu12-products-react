import { createContext } from "react"
import type { Product, ProductValues } from "../types/product"

export type DisplayMode = "grid" | "list"
export type LoadStatus = "loading" | "ready" | "error"

export type ProductsContextValue = {
    products: Product[]
    status: LoadStatus
    error: string
    displayMode: DisplayMode
    setDisplayMode: (mode: DisplayMode) => void
    reload: () => void
    addProduct: (values: ProductValues) => Promise<void>
    editProduct: (id: number, values: ProductValues) => Promise<void>
    removeProduct: (id: number) => Promise<void>
}

export const ProductsContext = createContext<ProductsContextValue | null>(null)
