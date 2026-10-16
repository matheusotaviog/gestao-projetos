import { NavLink, useNavigate } from 'react-router-dom'
import { Logo } from '../Logo/Logo'
import { useAuth } from '../../Context/AuthContext'

const navigation = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/projetos', label: 'Projetos' },
]

function Header() {
  const { token, username, logout } = useAuth()
  const navigate = useNavigate()

  function sair() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[rgba(251,251,253,0.8)] backdrop-blur-xl backdrop-saturate-150">
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex h-11 max-w-5xl items-center justify-center overflow-x-auto px-6"
      >
        <ul className="flex w-max items-center gap-8 text-xs text-[#1d1d1f]">
          <li>
            <NavLink to="/" aria-label="Mirrorwork" className="flex items-center">
              <Logo className="h-6 w-6" />
            </NavLink>
          </li>

          {navigation.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `whitespace-nowrap transition-opacity duration-200 hover:opacity-100 ${isActive ? 'opacity-100' : 'opacity-80'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}

          {token && username && (
            <li>
              <NavLink to={`/perfil/${username}`} className="whitespace-nowrap opacity-80 hover:opacity-100">
                Meu perfil
              </NavLink>
            </li>
          )}

          <li>
            {token ? (
              <button
                type="button"
                onClick={sair}
                className="whitespace-nowrap opacity-80 transition-opacity duration-200 hover:opacity-100"
              >
                Sair
              </button>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `whitespace-nowrap transition-opacity duration-200 hover:opacity-100 ${isActive ? 'opacity-100' : 'opacity-80'
                  }`
                }
              >
                Entrar
              </NavLink>
            )}
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
