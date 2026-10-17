type Props = {
  className?: string
}

export function Skeleton({ className = '' }: Props) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-black/[0.06] ${className}`} />
}

export function SkeletonProjetos({ quantidade = 3 }: { quantidade?: number }) {
  return (
    <ul role="status" aria-label="Carregando" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: quantidade }, (_, i) => (
        <li key={i} className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function SkeletonCandidatos({ quantidade = 6 }: { quantidade?: number }) {
  return (
    <ul role="status" aria-label="Buscando candidatos" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: quantidade }, (_, i) => (
        <li key={i} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
          <Skeleton className="h-3 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function SkeletonLinhas({ quantidade = 5 }: { quantidade?: number }) {
  return (
    <div role="status" aria-label="Carregando" className="mt-8 space-y-3 rounded-2xl bg-white p-4 shadow-sm">
      {Array.from({ length: quantidade }, (_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonDetalhes() {
  return (
    <section role="status" aria-label="Carregando projeto" className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="aspect-video w-full rounded-3xl" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-3/4" />
    </section>
  )
}

export function SkeletonPerfil() {
  return (
    <section role="status" aria-label="Carregando perfil" className="mx-auto max-w-5xl px-6 pb-12 pt-16">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
        <Skeleton className="h-28 w-28 shrink-0 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-1 sm:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="aspect-square rounded-none" />
        ))}
      </div>
    </section>
  )
}
