import { useContext } from "react"
import { ProductsContext } from "./products-context"

export default function useProducts() {
    const context = useContext(ProductsContext)
    if (!context) {
        throw new Error("useProducts harus dipakai di dalam ProductsProvider.")
    }
    return context
}
