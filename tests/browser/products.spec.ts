import { test, expect, type Page } from "@playwright/test"

type Item = { id: number; name: string; price: number }

const API = "http://127.0.0.1:3001"
const seed: Item[] = [
    { id: 1, name: "Buku", price: 15000 },
    { id: 2, name: "Pulpen", price: 5000 },
]

async function mockApi(page: Page, initial: Item[] = seed) {
    const items = initial.map((item) => ({ ...item }))
    let nextId = Math.max(0, ...items.map((item) => item.id)) + 1
    const headers = {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
        "access-control-allow-headers": "Content-Type, Accept",
    }

    await page.route(`${API}/**`, async (route) => {
        const request = route.request()
        if (request.method() === "OPTIONS") {
            await route.fulfill({ status: 204, headers })
            return
        }

        const { pathname } = new URL(request.url())
        const match = pathname.match(/^\/products(?:\/(\d+))?$/)
        const id = match?.[1] ? Number(match[1]) : undefined
        const notFound = {
            status: 404,
            headers,
            json: { message: "Produk tidak ditemukan" },
        }

        if (!match) return route.fulfill(notFound)

        if (request.method() === "GET" && id === undefined) {
            return route.fulfill({ headers, json: items })
        }
        if (request.method() === "GET" && id !== undefined) {
            const found = items.find((item) => item.id === id)
            return route.fulfill(found ? { headers, json: found } : notFound)
        }
        if (request.method() === "POST") {
            const body = request.postDataJSON() as Omit<Item, "id">
            const created = { id: nextId++, ...body }
            items.push(created)
            return route.fulfill({ status: 201, headers, json: created })
        }
        if (request.method() === "PUT") {
            const body = request.postDataJSON() as Item
            const index = items.findIndex((item) => item.id === body.id)
            if (index === -1) return route.fulfill(notFound)
            items[index] = body
            return route.fulfill({ headers, json: body })
        }
        if (request.method() === "DELETE" && id !== undefined) {
            const index = items.findIndex((item) => item.id === id)
            if (index === -1) return route.fulfill(notFound)
            const [removed] = items.splice(index, 1)
            return route.fulfill({
                headers,
                json: { message: "Produk dihapus", data: removed },
            })
        }
        return route.fulfill(notFound)
    })
}

const nav = (page: Page) =>
    page.getByRole("navigation", { name: "Navigasi utama" })

const cardOf = (page: Page, name: string) =>
    page.locator("article", {
        has: page.getByRole("heading", { name, exact: true }),
    })

test.beforeEach(async ({ page }) => {
    await mockApi(page)
})

test("dashboard menampilkan ringkasan dari sumber produk yang sama", async ({
    page,
}) => {
    await page.goto("/")
    await expect(
        page.getByRole("heading", { name: "Dashboard", level: 1 }),
    ).toBeVisible()
    await expect(
        page
            .locator("dt", { hasText: "Total produk" })
            .locator("xpath=following-sibling::dd"),
    ).toHaveText("2")

    await nav(page).getByRole("link", { name: "Produk" }).click()
    await expect(page).toHaveURL(/\/products$/)
    await expect(page.locator("article")).toHaveCount(2)

    await page.getByRole("button", { name: "Tambah produk" }).click()
    const dialog = page.getByRole("dialog")
    await dialog.getByLabel("Nama produk").fill("Penghapus")
    await dialog.getByLabel("Harga (Rp)").fill("3000")
    await dialog.getByRole("button", { name: "Simpan" }).click()
    await expect(page.locator("article")).toHaveCount(3)

    await nav(page).getByRole("link", { name: "Dashboard" }).click()
    await expect(
        page
            .locator("dt", { hasText: "Total produk" })
            .locator("xpath=following-sibling::dd"),
    ).toHaveText("3")
})

test("tambah produk: validasi menahan form, data valid tersimpan", async ({
    page,
}) => {
    await page.goto("/products")
    await page.getByRole("button", { name: "Tambah produk" }).click()
    const dialog = page.getByRole("dialog")
    await dialog.getByRole("button", { name: "Simpan" }).click()
    await expect(dialog.getByText("Nama produk wajib diisi.")).toBeVisible()
    await expect(dialog.getByText("Harga wajib diisi.")).toBeVisible()
    await expect(page.locator("article")).toHaveCount(2)

    await dialog.getByLabel("Nama produk").fill("Penghapus")
    await dialog.getByLabel("Harga (Rp)").fill("abc")
    await dialog.getByRole("button", { name: "Simpan" }).click()
    await expect(
        dialog.getByText("Harga harus berupa bilangan bulat lebih dari 0."),
    ).toBeVisible()

    await dialog.getByLabel("Harga (Rp)").fill("3000")
    await dialog.getByRole("button", { name: "Simpan" }).click()
    await expect(dialog).toBeHidden()
    await expect(page.getByRole("heading", { name: "Penghapus" })).toBeVisible()
    await expect(page.getByRole("status")).toContainText("berhasil ditambahkan")
})

test("edit dan hapus produk memperbarui daftar", async ({ page }) => {
    await page.goto("/products")

    await cardOf(page, "Buku").getByRole("button", { name: "Edit" }).click()
    const dialog = page.getByRole("dialog")
    await dialog.getByLabel("Nama produk").fill("Buku Tulis")
    await dialog.getByRole("button", { name: "Simpan" }).click()
    await expect(
        page.getByRole("heading", { name: "Buku Tulis" }),
    ).toBeVisible()

    await cardOf(page, "Pulpen").getByRole("button", { name: "Hapus" }).click()
    await page
        .getByRole("dialog")
        .getByRole("button", { name: "Hapus", exact: true })
        .click()
    await expect(page.getByRole("heading", { name: "Pulpen" })).toHaveCount(0)
    await expect(page.locator("article")).toHaveCount(1)
})

test("detail produk lewat akses langsung dan tautan kembali", async ({
    page,
}) => {
    await page.goto("/products/1")
    await expect(
        page.getByRole("heading", { name: "Buku", level: 1 }),
    ).toBeVisible()
    await page.getByRole("link", { name: "← Kembali ke daftar produk" }).click()
    await expect(page).toHaveURL(/\/products$/)
})

test("ID produk yang tidak ada menampilkan pesan jelas", async ({ page }) => {
    await page.goto("/products/9999")
    await expect(page.getByRole("alert")).toHaveText(
        "Produk dengan ID 9999 tidak ditemukan.",
    )
    await expect(
        page.getByRole("link", { name: "← Kembali ke daftar produk" }),
    ).toBeVisible()

    await page.goto("/products/abc")
    await expect(page.getByRole("alert")).toHaveText(
        "Produk dengan ID abc tidak ditemukan.",
    )
})

test("URL yang tidak dikenal menampilkan 404 dengan tautan kembali", async ({
    page,
}) => {
    await page.goto("/halaman-ngawur")
    await expect(
        page.getByRole("heading", { name: "Halaman tidak ditemukan" }),
    ).toBeVisible()
    await page.getByRole("link", { name: "Kembali ke Dashboard" }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(
        page.getByRole("heading", { name: "Dashboard", level: 1 }),
    ).toBeVisible()
})

test("pengaturan tampilan tersimpan di state bersama antar halaman", async ({
    page,
}) => {
    await page.goto("/settings")
    await page.getByRole("radio", { name: /List/ }).check()
    await nav(page).getByRole("link", { name: "Dashboard" }).click()
    await expect(
        page
            .locator("dt", { hasText: "Tampilan produk" })
            .locator("xpath=following-sibling::dd"),
    ).toHaveText("List")
    await nav(page).getByRole("link", { name: "Produk" }).click()
    await expect(page.locator("article")).toHaveCount(2)
})

test("navigasi dapat dijangkau dengan keyboard", async ({ page }) => {
    await page.goto("/")
    await page.keyboard.press("Tab")
    await expect(
        nav(page).getByRole("link", { name: "Dashboard" }),
    ).toBeFocused()
    await page.keyboard.press("Tab")
    await expect(nav(page).getByRole("link", { name: "Produk" })).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/\/products$/)
})

for (const width of [390, 1440]) {
    test(`halaman produk tidak melebar horizontal pada ${width}px`, async ({
        page,
    }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto("/products")
        await expect(page.locator("article")).toHaveCount(2)
        expect(
            await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth,
            ),
        ).toBe(true)
    })
}
