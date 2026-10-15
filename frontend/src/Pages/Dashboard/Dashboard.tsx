import { Link } from 'react-router-dom'

const features = [
  {
    eyebrow: 'Projetos',
    title: 'Todos os seus projetos em um lugar.',
    description:
      'Mostre o preview de projetos como um portifólio.',
    preview: [
      { label: 'Maratona de programação', value: 68 },
      { label: 'Estudo de banco de dados', value: 35 },
      { label: 'Projeto final', value: 12 },
    ],
  },
  {
    eyebrow: 'Tarefas',
    title: 'Saiba o que fazer agora.',
    description:
      'Cada tarefa tem status e data de entrega. Veja de relance o que está pendente, em andamento ou concluído.',
    preview: [
      { label: 'Modelar o banco', value: 100 },
      { label: 'Criar endpoints', value: 60 },
      { label: 'Conectar o frontend', value: 20 },
    ],
  },
  {
    eyebrow: 'Cronograma',
    title: 'Cada compromisso no seu horário.',
    description:
      'Agende blocos de estudo por dia da semana e vincule tarefas aos horários em que elas serão feitas.',
    preview: [
      { label: 'Seg · 19h às 21h', value: 80 },
      { label: 'Qua · 20h às 22h', value: 50 },
      { label: 'Sáb · 9h às 12h', value: 30 },
    ],
  },
]



function Dashboard() {
  return (
    <div className="bg-[#f5f5f7] text-[#1d1d1f]">
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-20 text-center">
        <p className="text-base font-semibold text-[#0071e3]">
          Gestão de estudos e tarefas
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
          Organize seus projetos, tarefas e cronograma em um só lugar.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-[#6e6e73]">
          Um espaço simples para transformar planos de estudo em rotina: cada
          projeto com suas tarefas e cada tarefa no seu horário.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/projetos"
            className="rounded-full bg-[#0071e3] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#0077ed]"
          >
            Ver projetos
          </Link>
          <Link
            to="/cronograma"
            className="rounded-full px-6 py-3 text-base font-medium text-[#0071e3] transition-colors hover:underline"
          >
            Ver cronograma ›
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-24 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.eyebrow}
            className="flex flex-col rounded-3xl bg-white p-8 shadow-sm"
          >
            <p className="text-sm font-semibold text-[#0071e3]">
              {feature.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight">
              {feature.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#6e6e73]">
              {feature.description}
            </p>

            <ul className="mt-8 space-y-4 border-t border-black/5 pt-6">
              {feature.preview.map((item) => (
                <li key={item.label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="text-[#6e6e73]">{item.value}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#e8e8ed]">
                    <div
                      className="h-full rounded-full bg-[#0071e3]"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="bg-white px-6 py-24 text-center text-gray-900">
        <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Comece pelo seu primeiro projeto.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[#a1a1a6]">
          Cadastre um projeto, adicione as tarefas e monte o seu cronograma da
          semana.
        </p>
        <Link
          to={"/projetos"}
          className="mt-8 inline-block rounded-full bg-[#0071e3] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#0077ed]"
        >
          Criar projeto
        </Link>
      </section>
    </div>
  )
}

export default Dashboard
