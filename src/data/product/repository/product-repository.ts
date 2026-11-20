import type { ProductRemoteSource } from "../source/product-remote.ts"
import type { ProductValues } from "../../../types/product"
import ProductModel from "../model/product-model.ts"
import ProductListParam from "../param/product-list-param.ts"

export default function ProductRepository(source: ProductRemoteSource) {
    async function getProductList(
        param = new ProductListParam(),
    ): Promise<ProductModel[]> {
        const response = await source.getProductListRemote(param)
        if (!Array.isArray(response)) {
            throw new TypeError(
                "Contoh ini mengharapkan response API berupa array produk.",
            )
        }

        const products = response.map((item) => ProductModel.fromResponse(item))
        const ids = products.map((product) => product.getId())
        if (new Set(ids).size !== ids.length) {
            throw new TypeError("ID produk dari API harus unik.")
        }

        return products
    }

    async function getProduct(id: number): Promise<ProductModel> {
        return ProductModel.fromResponse(await source.getProductRemote(id))
    }

    async function createProduct(values: ProductValues): Promise<ProductModel> {
        return ProductModel.fromResponse(
            await source.createProductRemote(values),
        )
    }

    async function updateProduct(
        id: number,
        values: ProductValues,
    ): Promise<ProductModel> {
        return ProductModel.fromResponse(
            await source.updateProductRemote(id, values),
        )
    }

    async function deleteProduct(id: number): Promise<void> {
        await source.deleteProductRemote(id)
    }

    return {
        getProductList,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
    }
}
