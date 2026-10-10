import { useEffect } from 'react'
import styles from './Toast.module.css'

export interface ToastProps {
  message: string
  actionLabel?: string
  onAction?: () => void
  onClose: () => void
  duration?: number
}

export function Toast({
  message,
  actionLabel,
  onAction,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <span className={styles.message}>{message}</span>
      <div className={styles.actions}>
        {actionLabel && onAction && (
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => {
              onAction()
              onClose()
            }}
          >
            {actionLabel}
          </button>
        )}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Fechar notificação"
        >
          ×
        </button>
      </div>
    </div>
  )
}
