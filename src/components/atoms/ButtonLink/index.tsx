import { Link, type LinkProps } from "react-router"
import styles from "./styles.module.css"

const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
}

type ButtonLinkProps = LinkProps & {
    variant?: keyof typeof variants
}

export default function ButtonLink({
    variant = "primary",
    className = "",
    ...props
}: ButtonLinkProps) {
    return (
        <Link
            className={`${styles.link} ${variants[variant]} ${className}`}
            {...props}
        />
    )
}
