import { NavLink } from 'react-router-dom'

const navigation = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/projetos', label: 'Projetos' },
  { to: '/tarefas', label: 'Tarefas' },
  { to: '/cronograma', label: 'Cronograma' },
]

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(22,22,23,0.72)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-6 px-6">
        <NavLink
          to="/"
          aria-label="Processos"
          className="shrink-0 text-white"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <ellipse cx="12" cy="8.5" rx="6.5" ry="7.5" />
            <path d="M9 6.5a4 4 0 0 1 2-2" />
            <path d="M12 16v6" />
          </svg>
        </NavLink>

        <nav aria-label="Navegação principal" className="min-w-0 overflow-x-auto">
          <ul className="flex items-center gap-5 whitespace-nowrap sm:gap-7">
            {navigation.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `text-xs transition-colors duration-200 ${isActive
                      ? 'text-white'
                      : 'text-[#e8e8ed]/80 hover:text-white'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
