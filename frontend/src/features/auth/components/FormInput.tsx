import type { InputHTMLAttributes } from 'react'
import styles from './AuthLayout.module.css'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
}

export function FormInput({
  id,
  label,
  error,
  className,
  ...rest
}: FormInputProps) {
  const errorId = `${id}-error`

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${styles.input} ${error ? styles.inputError : ''} ${className ?? ''}`}
        {...rest}
      />
      {error && (
        <span id={errorId} role="alert" className={styles.fieldError}>
          {error}
        </span>
      )}
    </div>
  )
}
