export type ProductFormErrors = {
    name?: string
    price?: string
}

export function validateProductForm(
    name: string,
    price: string,
): ProductFormErrors {
    const errors: ProductFormErrors = {}

    if (!name.trim()) {
        errors.name = "Nama produk wajib diisi."
    }

    const priceText = price.trim()
    if (!priceText) {
        errors.price = "Harga wajib diisi."
    } else if (
        !/^\d+$/.test(priceText) ||
        !Number.isSafeInteger(Number(priceText)) ||
        Number(priceText) <= 0
    ) {
        errors.price = "Harga harus berupa bilangan bulat lebih dari 0."
    }

    return errors
}
