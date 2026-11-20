import RootPage from "./page"
import { Route, Routes } from "react-router"
import PageLayout from "../src/components/templates/PageLayout"
import ProductsPage from "./products/page"
import ProductDetailPage from "./products/detail/page"
import SettingsPage from "./settings/page"
import NotFoundPage from "./not-found/page"

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<PageLayout />}>
                <Route index element={<RootPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}
