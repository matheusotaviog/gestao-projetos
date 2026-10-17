import { useState, type InputHTMLAttributes } from 'react'
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
  type = 'text',
  className,
  ...rest
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordType = type === 'password'
  const currentType = isPasswordType && showPassword ? 'text' : type
  const errorId = `${id}-error`

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={styles.inputWrapper}>
        <input
          id={id}
          type={currentType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${styles.input} ${isPasswordType ? styles.passwordInput : ''} ${error ? styles.inputError : ''} ${className ?? ''}`}
          {...rest}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={styles.passwordToggle}
            aria-label={showPassword ? `Ocultar ${label.toLowerCase()}` : `Ver ${label.toLowerCase()}`}
            title={showPassword ? 'Ocultar senha' : 'Ver senha'}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && (
        <span id={errorId} role="alert" className={styles.fieldError}>
          {error}
        </span>
      )}
    </div>
  )
}
