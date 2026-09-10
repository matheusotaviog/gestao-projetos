export type ThemeId = 'default' | 'warm-paper' | 'sage-focus'

export interface ThemeOption {
  id: ThemeId
  label: string
}

export const THEMES: ThemeOption[] = [
  { id: 'default', label: 'Padrão' },
  { id: 'warm-paper', label: 'Papel' },
  { id: 'sage-focus', label: 'Sálvia' },
]

const THEME_KEY = 'gestao_projetos_theme'

export const themeService = {
  getTheme(): ThemeId {
    if (typeof window === 'undefined') {
      return 'default'
    }
    const saved = localStorage.getItem(THEME_KEY) as ThemeId | null
    if (
      saved &&
      (saved === 'default' || saved === 'warm-paper' || saved === 'sage-focus')
    ) {
      return saved
    }
    return 'default'
  },

  setTheme(theme: ThemeId): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, theme)
      document.documentElement.setAttribute('data-theme', theme)
      window.dispatchEvent(new CustomEvent('themechange', { detail: theme }))
    }
  },

  initTheme(): ThemeId {
    const current = this.getTheme()
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', current)
    }
    return current
  },
}
