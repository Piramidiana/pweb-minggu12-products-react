import "./globals.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import AppRoutes from "./routes"
import ProductsProvider from "../src/context/ProductsProvider"

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Root element is missing.")

createRoot(rootElement).render(
    <StrictMode>
        <BrowserRouter>
            <ProductsProvider>
                <AppRoutes />
            </ProductsProvider>
        </BrowserRouter>
    </StrictMode>,
)
