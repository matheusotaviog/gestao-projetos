import type { ReactNode } from 'react'
import { ThemeSelector } from '../../../components/ui/ThemeSelector'
import styles from './AuthLayout.module.css'

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className={styles.container}>
      <main className={styles.card}>
        <div className={styles.cardTopBar}>
          <ThemeSelector />
        </div>

        <header className={styles.header}>
          <div className={styles.brand}>Processos</div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>

        {children}

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </main>
    </div>
  )
}
