const M = 'M14 30 L14 14 L21 14 L32 25 L43 14 L50 14 L50 30 L44 30 L44 22 L35 31 L29 31 L20 22 L20 30 Z'

type Props = {
  className?: string
}

export function Logo({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="mirrorwork-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffab4a" />
          <stop offset="1" stopColor="#ff4d8d" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#mirrorwork-grad)" />
      <path d={M} fill="#0b0c10" />
      <path d={M} fill="#0b0c10" opacity="0.35" transform="translate(0 72) scale(1 -1)" />
    </svg>
  )
}
