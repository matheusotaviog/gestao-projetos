import { Link } from 'react-router-dom'

const columns = [
  {
    titulo: 'Navegação',
    links: [
      { to: '/', label: 'Dashboard' },
      { to: '/projetos', label: 'Projetos' },
    ],
  },
  {
    titulo: 'Conta',
    links: [
      { to: '/cadastro', label: 'Criar conta' },
      { to: '/login', label: 'Entrar' },
    ],
  },
]

const linkClass = 'text-[#6e6e73] transition-colors hover:text-[#1d1d1f] hover:underline'

function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer className="bg-[#f5f5f7] text-xs text-[#6e6e73]">
      <div className="mx-auto max-w-5xl px-6 pt-6 pb-4">
        <p className="leading-relaxed">
          Projeto final da Formação de Desenvolvedor Full Stack da +praTi.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-8 border-t border-black/10 pt-6 md:grid-cols-3">
          {columns.map((coluna) => (
            <div key={coluna.titulo}>
              <h2 className="mb-3 font-semibold text-[#1d1d1f]">{coluna.titulo}</h2>
              <ul className="space-y-2">
                {coluna.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="mb-3 font-semibold text-[#1d1d1f]">Código</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/matheusotaviog/gestao-projetos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Repositório no GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-black/10 pt-4 md:flex-row md:items-center md:justify-between">
          <p>Copyright © {ano} Processos. Todos os direitos reservados.</p>
          <p>Português (Brasil)</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
