import * as si from 'simple-icons'

type Props = {
  tipo: 'github' | 'linkedin' | 'site'
  href: string
}

const ROTULOS = { github: 'GitHub', linkedin: 'LinkedIn', site: 'Site' }

export function LinkSocial({ tipo, href }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-white/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white"
    >
      {tipo === 'github' && (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d={si.siGithub.path} /></svg>
      )}
      {tipo === 'linkedin' && (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="M3 2h18a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm2.5 7.5V19h3V9.5h-3zm1.5-4.6a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM11 9.5V19h3v-5c0-1.4.6-2.3 1.8-2.3 1.1 0 1.7.8 1.7 2.3V19h3v-5.6c0-2.9-1.5-4.3-3.6-4.3-1.6 0-2.4.9-2.8 1.5V9.5H11z" />
        </svg>
      )}
      {tipo === 'site' && (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      )}
      {ROTULOS[tipo]}
    </a>
  )
}
