import { Link } from 'react-router-dom'
import { FaixaTecnologias, Showcase } from '../../components/Showcase/Showcase'

function Dashboard() {
  return (
    <div className="relative overflow-hidden bg-[#07080a] text-[#f4f1ea]">
      <div className="pointer-events-none absolute inset-0 bg-grade" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.07]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06]" aria-hidden="true" />

      <section className="relative flex min-h-[92vh] flex-col justify-end px-6 pb-20 pt-32 sm:px-12 lg:px-20">
        <p className="animate-fade-up text-xs font-medium uppercase tracking-[0.4em] text-[#f4f1ea]/60">
          Gestão de projetos · Perfil público
        </p>
        <h1 className="animate-fade-up mt-6 text-[clamp(3.5rem,13vw,11rem)] font-black uppercase leading-[0.85] tracking-tighter [animation-delay:150ms]">
          Mirrorwork
        </h1>
        <div className="animate-fade-up mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between [animation-delay:300ms]">
          <p className="max-w-md text-lg leading-relaxed text-[#f4f1ea]/75">
            Organize o que você constrói e mostre ao mundo como você trabalha.
          </p>
          <div className="flex gap-4">
            <Link
              to="/cadastro"
              className="rounded-none bg-[#f4f1ea] px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#07080a] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Criar conta
            </Link>
            <Link
              to="/login"
              className="border border-[#f4f1ea]/40 px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors duration-300 hover:border-[#f4f1ea] hover:bg-[#f4f1ea]/5"
            >
              Entrar
            </Link>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-32 sm:px-12 lg:px-20">
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-[#f4f1ea]/50">Sobre</p>
        <p className="mt-6 max-w-5xl text-[clamp(1.75rem,4vw,3.5rem)] font-light leading-tight tracking-tight">
          Cada projeto é uma história. A sua merece ser contada com <span className="font-semibold">cuidado</span>, do primeiro rascunho ao último ajuste.
        </p>
      </section>

      <FaixaTecnologias />

      <section className="relative px-6 pb-40 pt-32 sm:px-12 lg:px-20">
        <Showcase />
      </section>

      <section className="relative flex flex-col items-center px-6 py-40 text-center">
        <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-black uppercase leading-[0.9] tracking-tighter">
          Seu próximo<br />projeto começa aqui
        </h2>
        <Link
          to="/cadastro"
          className="mt-12 bg-[#f4f1ea] px-10 py-5 text-sm font-bold uppercase tracking-widest text-[#07080a] transition-transform duration-300 hover:-translate-y-0.5"
        >
          Criar conta
        </Link>
      </section>
    </div>
  )
}

export default Dashboard
