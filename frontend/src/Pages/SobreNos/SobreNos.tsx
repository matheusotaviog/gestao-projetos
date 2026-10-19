import { equipe, type Integrante } from '../../data/equipe'

function Avatar({ integrante }: { integrante: Integrante }) {
  const iniciais = integrante.nome.split(' ').map((p) => p.charAt(0)).slice(0, 2).join('').toUpperCase()
  return (
    <div className="mx-auto -mt-16 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#d2d2d7] bg-white text-2xl font-semibold text-[#6e6e73]">
      {integrante.foto ? (
        <img src={integrante.foto} alt={integrante.nome} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        iniciais
      )}
    </div>
  )
}

export function SobreNos() {
  return (
    <div className="bg-[#f5f5f7]">
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0071e3]">Sobre nós</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">As pessoas por trás da Mirrorwork</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-[#6e6e73]">
          Somos uma equipe de cinco desenvolvedores que criou esta plataforma para que cada profissional possa mostrar o que constrói.
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {equipe.map((integrante) => (
          <article key={integrante.nome} className="rounded-2xl bg-white px-6 pb-8 pt-0 text-center shadow-sm">
            <Avatar integrante={integrante} />
            <h2 className="mt-5 text-lg font-semibold">{integrante.nome}</h2>
            <p className="mt-1 text-sm font-medium text-[#0071e3]">{integrante.funcao}</p>
            <p className="mt-4 text-sm italic leading-relaxed text-[#6e6e73]">{integrante.descricao}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
