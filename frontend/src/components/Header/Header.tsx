import { NavLink } from 'react-router-dom'

const navigation = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/projetos', label: 'Projetos' },
  { to: '/tarefas', label: 'Tarefas' },
  { to: '/cronograma', label: 'Cronograma' },
]

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[rgba(251,251,253,0.8)] backdrop-blur-xl backdrop-saturate-150">
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex h-11 max-w-5xl items-center justify-center overflow-x-auto px-6"
      >
        <ul className="flex w-max items-center gap-8 text-xs text-[#1d1d1f]">
          <li>
            <NavLink to="/" aria-label="Processos" className="flex items-center">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
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
          </li>

          {navigation.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `whitespace-nowrap transition-opacity duration-200 hover:opacity-100 ${
                    isActive ? 'opacity-100' : 'opacity-80'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
