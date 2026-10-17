import { TecnologiaIcon } from '../TecnologiasPicker/TecnologiaIcon'

function Etiqueta({ numero, titulo, texto }: { numero: string; titulo: string; texto: string }) {
  return (
    <div>
      <span className="font-mono text-sm text-[#f4f1ea]/40">{numero}</span>
      <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight sm:text-5xl">{titulo}</h2>
      <p className="mt-5 max-w-md text-base leading-relaxed text-[#f4f1ea]/65">{texto}</p>
    </div>
  )
}

function Janela({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0d12] shadow-[0_30px_80px_-30px_rgba(255,140,60,0.25)]">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

const projetos = [
  { nome: 'Educ-dev', ano: 2025, tom: 25 },
  { nome: 'Clarim Diário', ano: 2025, tom: 200 },
  { nome: 'Mirrorwork', ano: 2026, tom: 330 },
]

function MockProjetos() {
  return (
    <Janela>
      <p className="mb-4 text-sm font-semibold">Meus Projetos</p>
      <div className="grid grid-cols-3 gap-2">
        {projetos.map((p) => (
          <div key={p.nome} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-transform duration-500 hover:-translate-y-1">
            <div
              className="flex aspect-video items-center justify-center text-2xl font-black text-white/90"
              style={{ background: `linear-gradient(135deg, hsl(${p.tom} 85% 55%), hsl(${(p.tom + 60) % 360} 80% 25%))` }}
            >
              {p.nome.charAt(0)}
            </div>
            <div className="p-2.5">
              <p className="truncate text-xs font-semibold">{p.nome}</p>
              <p className="text-[10px] text-white/45">{p.ano}</p>
            </div>
          </div>
        ))}
      </div>
    </Janela>
  )
}

function MockPainel() {
  return (
    <Janela>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-bold">Educ-dev</p>
          <p className="text-xs text-white/45">2025</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Editar</span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-white/70">Plataforma de estudos com trilhas, exercícios e acompanhamento do progresso.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Claude'].map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs">
            <TecnologiaIcon nome={t} tamanho={12} />
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-white/5 p-3 font-mono text-xs text-white/60">
        <p># Educ-dev</p>
        <p className="mt-1">Trilhas de estudo com quiz e ranking...</p>
        <p className="mt-2 text-[#ffab4a]">Ler mais...</p>
      </div>
    </Janela>
  )
}

function MockPerfil() {
  return (
    <Janela>
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-gradient-to-br from-[#ffab4a] to-[#ff4d8d] p-[2px]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0c0d12] text-xl font-black">D</div>
        </div>
        <div>
          <p className="text-sm font-bold">Gabriel Dantas</p>
          <p className="text-xs text-[#ffab4a]">@dantas</p>
          <p className="mt-1 text-[11px] text-white/50">3 projetos · 2025 – 2026</p>
        </div>
      </div>
      <div className="relative mt-4 grid grid-cols-3 gap-1">
        {[25, 200, 330].map((tom, i) => (
          <div
            key={tom}
            className="group relative aspect-square overflow-hidden"
            style={{ background: `linear-gradient(135deg, hsl(${tom} 85% 55%), hsl(${(tom + 60) % 360} 80% 25%))` }}
          >
            {i === 1 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70">
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-black">Abrir ↗</span>
                <span className="rounded-full border border-white/60 px-2.5 py-1 text-[10px] text-white">Detalhes</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Janela>
  )
}

const candidatos = [
  { nome: 'Gabriel Dantas', prof: 'Desenvolvedor Full Stack', techs: ['React', 'Java'] },
  { nome: 'Ana Ribeiro', prof: 'Designer UI/UX', techs: ['Figma', 'Tailwind'] },
]

function MockRecrutador() {
  return (
    <Janela>
      <div className="space-y-2">
        {candidatos.map((c) => (
          <div key={c.nome} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ffab4a] to-[#ff4d8d] text-sm font-bold text-[#0b0c10]">{c.nome.charAt(0)}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{c.nome}</p>
              <p className="truncate text-[10px] text-white/50">{c.prof}</p>
            </div>
            <div className="flex gap-1">
              {c.techs.map((t) => <TecnologiaIcon key={t} nome={t} tamanho={14} />)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2 rounded-xl bg-white/5 p-3">
        <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-white/10 px-3 py-2 text-xs">Vi seu projeto Educ-dev. Podemos conversar?</div>
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-gradient-to-br from-[#ffab4a] to-[#ff4d8d] px-3 py-2 text-xs text-[#0b0c10]">Claro! Vamos marcar uma call.</div>
      </div>
    </Janela>
  )
}

const blocos = [
  {
    numero: '01',
    titulo: 'Projetos',
    texto: 'Cada projeto com descrição, link, ano e uma imagem de capa que você escolhe. Tudo em cards que chamam atenção.',
    Mock: MockProjetos,
  },
  {
    numero: '02',
    titulo: 'Painel de gestão',
    texto: 'Só você vê o painel: descrição, tecnologias com ícones e o README completo do seu projeto.',
    Mock: MockPainel,
  },
  {
    numero: '03',
    titulo: 'Perfil público',
    texto: 'Uma página sua, com foto, bio e a grade de projetos. Quem visita passa o mouse e vê os detalhes.',
    Mock: MockPerfil,
  },
  {
    numero: '04',
    titulo: 'Para recrutadores',
    texto: 'Busque candidatos por profissão e tecnologia, abra o portfólio e converse direto pelo chat.',
    Mock: MockRecrutador,
  },
]

export function Showcase() {
  return (
    <div className="space-y-32">
      {blocos.map(({ numero, titulo, texto, Mock }, i) => (
        <div key={numero} className="grid items-center gap-12 lg:grid-cols-2">
          {i % 2 ? (
            <>
              <div className="lg:order-2"><Mock /></div>
              <Etiqueta numero={numero} titulo={titulo} texto={texto} />
            </>
          ) : (
            <>
              <Etiqueta numero={numero} titulo={titulo} texto={texto} />
              <Mock />
            </>
          )}
        </div>
      ))}
    </div>
  )
}
