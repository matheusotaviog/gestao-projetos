const M = 'M14 30 L14 14 L21 14 L32 25 L43 14 L50 14 L50 30 L44 30 L44 22 L35 31 L29 31 L20 22 L20 30 Z'

type Props = {
  className?: string
}

export function Logo({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#0b0c10" />
      <path d={M} fill="#ffffff" />
      <path d={M} fill="#ffffff" opacity="0.35" transform="translate(0 72) scale(1 -1)" />
    </svg>
  )
}
