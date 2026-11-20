import type { InputHTMLAttributes, Ref } from "react"
import styles from "./styles.module.css"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    invalid?: boolean
    ref?: Ref<HTMLInputElement>
}

export default function Input({
    invalid = false,
    className = "",
    ...props
}: InputProps) {
    return (
        <input
            aria-invalid={invalid || undefined}
            className={`${styles.input} ${invalid ? styles.invalid : ""} ${className}`}
            {...props}
        />
    )
}
