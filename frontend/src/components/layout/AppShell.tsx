import { NavLink, Outlet } from 'react-router'
import styles from './AppShell.module.css'

const navigation = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/projetos', label: 'Projetos' },
  { to: '/tarefas', label: 'Tarefas' },
  { to: '/cronograma', label: 'Cronograma' },
]

export function AppShell() {
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
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}