import { useEffect, useState, type ChangeEvent } from 'react'
import {
  THEMES,
  themeService,
  type ThemeId,
} from '../../features/theme/themeService'
import styles from './ThemeSelector.module.css'

export function ThemeSelector() {
  const [theme, setTheme] = useState<ThemeId>(() => themeService.getTheme())

  useEffect(() => {
    themeService.initTheme()

    function handleThemeChange(event: Event) {
      const customEvent = event as CustomEvent<ThemeId>
      if (customEvent.detail) {
        setTheme(customEvent.detail)
      }
    }

    window.addEventListener('themechange', handleThemeChange)
    return () => window.removeEventListener('themechange', handleThemeChange)
  }, [])

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextTheme = event.target.value as ThemeId
    setTheme(nextTheme)
    themeService.setTheme(nextTheme)
  }

  return (
    <div className={styles.container}>
      <label htmlFor="theme-select" className={styles.label}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2Z" />
        </svg>
        <span className={styles.srOnly}>Tema visual</span>
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={handleChange}
        className={styles.select}
        aria-label="Selecionar tema visual"
      >
        {THEMES.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
