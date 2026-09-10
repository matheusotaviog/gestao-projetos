import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { themeService } from './features/theme/themeService'
import './styles/tokens.css'
import './styles/globals.css'

themeService.initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)