import ProductListParam from "../param/product-list-param.ts"
import type { ProductValues } from "../../../types/product"

export class ProductApiError extends Error {
    readonly status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = "ProductApiError"
        this.status = status
    }
}

export type ProductRemoteSource = {
    getProductListRemote: (param?: ProductListParam) => Promise<unknown>
    getProductRemote: (id: number) => Promise<unknown>
    createProductRemote: (values: ProductValues) => Promise<unknown>
    updateProductRemote: (id: number, values: ProductValues) => Promise<unknown>
    deleteProductRemote: (id: number) => Promise<void>
}

type ProductRemoteOptions = {
    baseUrl?: string
    fetchImpl?: typeof fetch
}

const acceptJson = { Accept: "application/json" }
const sendJson = { ...acceptJson, "Content-Type": "application/json" }

async function readErrorMessage(
    response: Response,
    fallback: string,
): Promise<string> {
    try {
        const body: unknown = await response.json()
        if (
            typeof body === "object" &&
            body !== null &&
            "message" in body &&
            typeof body.message === "string"
        ) {
            return body.message
        }
    } catch {
        return fallback
    }
    return fallback
}

export default function ProductRemote({
    baseUrl = "",
    fetchImpl = fetch,
}: ProductRemoteOptions = {}): ProductRemoteSource {
    function buildUrl(path: string): URL {
        if (!baseUrl.trim()) {
            throw new Error(
                "Isi VITE_API_BASE_URL di .env.local terlebih dahulu.",
            )
        }

        const url = new URL(`${baseUrl.replace(/\/+$/, "")}${path}`)
        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("URL API harus menggunakan http atau https.")
        }
        return url
    }

    async function send(
        url: URL,
        init: RequestInit,
        failure: string,
    ): Promise<Response> {
        const response = await fetchImpl(url, init)
        if (!response.ok) {
            const fallback = `${failure} (HTTP ${response.status}).`
            throw new ProductApiError(
                await readErrorMessage(response, fallback),
                response.status,
            )
        }
        return response
    }

    async function getProductListRemote(
        param = new ProductListParam(),
    ): Promise<unknown> {
        const url = buildUrl("/products")
        url.search = param.toQueryString()
        const response = await send(
            url,
            { method: "GET", headers: acceptJson },
            "Gagal memuat produk",
        )
        return response.json()
    }

    async function getProductRemote(id: number): Promise<unknown> {
        const response = await send(
            buildUrl(`/products/${id}`),
            { method: "GET", headers: acceptJson },
            "Gagal memuat produk",
        )
        return response.json()
    }

    async function createProductRemote(
        values: ProductValues,
    ): Promise<unknown> {
        const response = await send(
            buildUrl("/products"),
            { method: "POST", headers: sendJson, body: JSON.stringify(values) },
            "Gagal menambah produk",
        )
        return response.json()
    }

    async function updateProductRemote(
        id: number,
        values: ProductValues,
    ): Promise<unknown> {
        const response = await send(
            buildUrl("/products"),
            {
                method: "PUT",
                headers: sendJson,
                body: JSON.stringify({ id, ...values }),
            },
            "Gagal mengubah produk",
        )
        return response.json()
    }

    async function deleteProductRemote(id: number): Promise<void> {
        await send(
            buildUrl(`/products/${id}`),
            { method: "DELETE", headers: acceptJson },
            "Gagal menghapus produk",
        )
    }

    return {
        getProductListRemote,
        getProductRemote,
        createProductRemote,
        updateProductRemote,
        deleteProductRemote,
    }
}
