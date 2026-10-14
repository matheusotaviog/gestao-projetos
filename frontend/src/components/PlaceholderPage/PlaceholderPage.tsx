type PlaceholderPageProps = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-5xl font-semibold tracking-tight">{title}</h1>
      <p className="mx-auto mt-4 text-lg text-[#6e6e73]">{description}</p>
    </section>
  )
}
