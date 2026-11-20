import { NavLink, Outlet } from "react-router"
import styles from "./styles.module.css"

const links = [
    { to: "/", label: "Dashboard", end: true },
    { to: "/products", label: "Produk", end: false },
    { to: "/settings", label: "Pengaturan", end: false },
]

export default function PageLayout() {
    return (
        <div className={styles.shell}>
            <header className={styles.header}>
                <nav aria-label="Navigasi utama" className={styles.nav}>
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.link} ${styles.active}`
                                    : styles.link
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </header>
            <main className={styles.container}>
                <Outlet />
            </main>
        </div>
    )
}
