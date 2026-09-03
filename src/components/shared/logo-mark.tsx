import { cn } from '@/lib/utils'

export function LogoMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={cn('shrink-0', className)} style={style} aria-hidden>
      <defs>
        <clipPath id="hisen-badge-clip">
          <path d="M50 3L90 24V63L74 80L50 97L26 80L10 63V24L50 3Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#hisen-badge-clip)">
        <rect x="0" y="0" width="100" height="100" fill="currentColor" />
        <polygon points="38,0 62,0 40,100 16,100" fill="var(--logo-stripe, white)" />
      </g>
    </svg>
  )
}
