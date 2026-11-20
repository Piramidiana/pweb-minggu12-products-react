import { test } from "node:test"
import assert from "node:assert/strict"
import { validateProductForm } from "../src/utils/validateProduct.ts"

test("form yang valid tidak menghasilkan error", () => {
    assert.deepEqual(validateProductForm(" Pulpen ", "5000"), {})
})

test("nama dan harga kosong ditolak", () => {
    const errors = validateProductForm("   ", "")
    assert.equal(errors.name, "Nama produk wajib diisi.")
    assert.equal(errors.price, "Harga wajib diisi.")
})

test("harga harus bilangan bulat lebih dari 0", () => {
    for (const price of ["0", "-5", "1.5", "abc", "1e3"]) {
        assert.equal(
            validateProductForm("Buku", price).price,
            "Harga harus berupa bilangan bulat lebih dari 0.",
        )
    }
})
