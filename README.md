# Manajemen Produk React — Tugas 4

Aplikasi ini adalah **Tugas 4 Pemrograman Web**: pengembangan Manajemen Produk (CRUD) dengan **React Router** dan **Tailwind CSS**. Dibuat dari template dosen ([anasmcfudy/react-template](https://github.com/anasmcfudy/react-template)) memakai React 19, TypeScript, Vite, React Router, dan Tailwind CSS v4.

## Routes

| URL | Halaman | Keterangan |
| --- | --- | --- |
| `/` | Dashboard | Ringkasan dari data produk yang sama dengan halaman produk (total produk dan harga tertinggi) |
| `/products` | Daftar produk | Cari, tambah, edit, hapus lewat modal dengan validasi; tampilan grid atau list sesuai pengaturan |
| `/products/:id` | Detail produk | Detail berdasarkan ID, tautan kembali ke daftar, pesan jelas bila ID tidak ada atau tidak valid |
| `/settings` | Pengaturan | Memilih tampilan grid atau list yang dipakai `/products` |
| `*` | 404 | Pesan jelas dan tautan kembali ke Dashboard dan daftar produk |

Semua halaman berada di dalam `PageLayout` (navbar `NavLink` dan `Outlet`).

## Cara menjalankan

Syarat: Node.js 22.12 atau lebih baru.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Buka `http://127.0.0.1:5173`. Di `.env.local` isi alamat backend (endpoint ada di `/products`, tanpa `/api`):

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

Restart `npm run dev` setelah mengubah `.env.local`. Backend memakai REST API produk Tugas 2 (Express, Prisma, Neon) dan harus mengizinkan origin `http://127.0.0.1:5173` melalui CORS.

Kontrak API yang dipakai:

| Aksi | Request |
| --- | --- |
| Daftar | `GET /products` |
| Detail | `GET /products/:id` |
| Tambah | `POST /products` dengan body `{ name, price }` |
| Edit | `PUT /products` dengan body `{ id, name, price }` |
| Hapus | `DELETE /products/:id` |

## Letak shared state

State bersama berada **di atas `Routes`**, bukan di tiap halaman. `ProductsProvider` membungkus `<AppRoutes />` di `app/entry.tsx`, di dalam `BrowserRouter`:

- `products`, `status`, `error`: data produk dan status pemuatan dari API.
- `displayMode` dan `setDisplayMode`: pilihan grid atau list.
- `addProduct`, `editProduct`, `removeProduct`, `reload`: operasi yang memperbarui state setelah API berhasil.

Dashboard, daftar produk, dan pengaturan membaca state yang sama lewat hook `useProducts()`, sehingga angka di Dashboard ikut berubah setelah produk ditambah atau dihapus, dan pilihan di Pengaturan langsung dipakai `/products`. Halaman detail mengambil satu produk berdasarkan ID dari API lewat repository yang sama.

Berkas terkait: `src/context/products-context.ts`, `src/context/ProductsProvider.tsx`, `src/context/useProducts.ts`.

## Pembagian komponen

Mengikuti Atomic Design dari template:

```text
app/                      # Pembungkus route (entry, routes, page.tsx per URL)
src/
  components/
    atoms/                # Button, ButtonLink, Input
    molecules/            # ProductCard, FormField, Modal
    organisms/            # ProductGrid, ProductFormModal, ConfirmDeleteModal
    templates/            # PageLayout (navbar + Outlet)
    pages/                # DashboardPage, ProductsPage, ProductDetailPage,
                          # SettingsPage, NotFoundPage
  context/                # State bersama produk dan displayMode
  data/product/           # model, source (HTTP), repository (validasi)
  utils/                  # validateProduct, formatRupiah
tests/                    # Unit test dan tes browser (Playwright)
```

Alur data: `ProductRemote` (HTTP) → `ProductRepository` (validasi dengan `ProductModel`) → `ProductsProvider` → halaman → komponen. Modal memakai elemen `<dialog>` bawaan (Esc dan klik latar menutup, fokus pindah ke kolom pertama yang tidak valid).

## Perintah

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan aplikasi |
| `npm run typecheck` | Memeriksa tipe TypeScript |
| `npm run lint` | Memeriksa aturan kode |
| `npm test` | Unit test (data layer dan validasi) |
| `npm run test:e2e` | Tes browser Playwright (memerlukan Google Chrome dan port 5173 yang kosong; API di-mock sehingga backend tidak perlu aktif) |
| `npm run build` | Memeriksa tipe dan membuat build produksi |

## Skenario pengujian

| Skenario | Hasil yang diharapkan |
| --- | --- |
| ID tidak ada (`/products/9999`) | Pesan "Produk dengan ID 9999 tidak ditemukan." dan tautan kembali |
| ID tidak valid (`/products/abc`) | Pesan tidak ditemukan dan tautan kembali |
| URL tidak dikenal (`/halaman-ngawur`) | Halaman 404 dengan tautan kembali |
| Lebar layar 390px dan 1440px | Tidak ada scroll horizontal |
| Keyboard | Tab menjangkau navbar secara berurutan, Enter membuka halaman |
| Akses langsung ke `/products/1` | Detail produk tampil tanpa melalui daftar |
| Form tambah kosong atau harga bukan angka | Pesan validasi tampil, data tidak tersimpan |

Dokumen ini disusun untuk **Tugas 4**.
