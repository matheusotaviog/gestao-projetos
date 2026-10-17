import * as si from 'simple-icons'

const ICONES: Record<string, { path: string; hex: string } | undefined> = {
  HTML: si.siHtml5,
  CSS: si.siCss,
  SASS: si.siSass,
  TailwindCSS: si.siTailwindcss,
  JavaScript: si.siJavascript,
  TypeScript: si.siTypescript,
  React: si.siReact,
  Next: si.siNextdotjs,
  Angular: si.siAngular,
  'Node.js': si.siNodedotjs,
  'Express.js': si.siExpress,
  Fastify: si.siFastify,
  Java: si.siOpenjdk,
  'Spring Boot': si.siSpringboot,
  MySQL: si.siMysql,
  PostgreSQL: si.siPostgresql,
  Prisma: si.siPrisma,
  DBeaver: si.siDbeaver,
  Docker: si.siDocker,
  Ubuntu: si.siUbuntu,
  Git: si.siGit,
  Figma: si.siFigma,
  Postman: si.siPostman,
  Insomnia: si.siInsomnia,
  n8n: si.siN8n,
  Claude: si.siClaude,
  Gemini: si.siGooglegemini,
  Copilot: si.siGithubcopilot,
}

type Props = {
  nome: string
  tamanho?: number
}

export function TecnologiaIcon({ nome, tamanho = 16 }: Props) {
  const icone = ICONES[nome]

  if (!icone) {
    return (
      <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
      </svg>
    )
  }

  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true">
      <path d={icone.path} fill={`#${icone.hex}`} />
    </svg>
  )
}
