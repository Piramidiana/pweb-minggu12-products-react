import { useId, type InputHTMLAttributes, type Ref } from "react"
import Input from "../../atoms/Input"
import styles from "./styles.module.css"

type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
    label: string
    error?: string
    inputRef?: Ref<HTMLInputElement>
}

export default function FormField({
    label,
    error = "",
    inputRef,
    ...props
}: FormFieldProps) {
    const id = useId()
    const errorId = `${id}-error`

    return (
        <div className={styles.field}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <Input
                id={id}
                ref={inputRef}
                invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                {...props}
            />
            {error && (
                <p id={errorId} className={styles.error}>
                    {error}
                </p>
            )}
        </div>
    )
}
