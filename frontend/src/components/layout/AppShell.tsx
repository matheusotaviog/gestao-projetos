import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { authService } from '../../features/auth/services/authService'
import { ThemeSelector } from '../ui/ThemeSelector'
import styles from './AppShell.module.css'

const navigation = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/projetos', label: 'Projetos' },
  { to: '/tarefas', label: 'Tarefas' },
  { to: '/cronograma', label: 'Cronograma' },
]

export function AppShell() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    authService.isAuthenticated(),
  )

  function handleLogout() {
    authService.removeToken()
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <strong className={styles.brand}>Processos</strong>

        <nav aria-label="Navegação principal">
          <ul className={styles.navigation}>
            {navigation.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : styles.link
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className={styles.page}>
        <header className={styles.header}>
          <span>Gestão de Estudos e Tarefas</span>

          <div className={styles.headerActions}>
            <ThemeSelector />

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Sair
              </button>
            ) : (
              <>
                <Link to="/login" className={styles.authLink}>
                  Entrar
                </Link>
                <Link to="/cadastro" className={styles.authButton}>
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}