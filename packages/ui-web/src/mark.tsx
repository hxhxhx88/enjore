import type { LucideProps } from 'lucide-react'
import type { ComponentType, JSX } from 'react'
import type { GlyphKey } from './lib/glyphs'
import { AwardIcon, CarrotIcon, ChefHatIcon, GemIcon, LeafIcon, MapPinIcon, StarIcon, UtensilsIcon } from 'lucide-react'
import { isGlyphKey } from './lib/glyphs'
import { cn } from './lib/utils'

interface Glyph {
  readonly Icon: ComponentType<LucideProps>
  // Closed shapes read better filled at small sizes; shapes drawn with inner strokes stay outlined.
  readonly fill: boolean
}

// Lucide drawings for now. A hand-drawn SVG component taking the same props drops in here later without touching the
// callers.
const glyphs: Readonly<Record<GlyphKey, Glyph>> = {
  star: { Icon: StarIcon, fill: true },
  diamond: { Icon: GemIcon, fill: false },
  toque: { Icon: ChefHatIcon, fill: false },
  fork: { Icon: UtensilsIcon, fill: false },
  radish: { Icon: CarrotIcon, fill: false },
  pin: { Icon: MapPinIcon, fill: false },
  leaf: { Icon: LeafIcon, fill: true },
  generic: { Icon: AwardIcon, fill: false },
}

interface Props {
  readonly glyphKey: string
  readonly count: number
  readonly className?: string | undefined
}

// The drawing of `glyphKey` repeated `count` times (clamped to 1–10). Glyphs are `1em` wide, so the surrounding font
// size sets their size and no `rem` is involved.
export function Mark({ glyphKey, count, className }: Props): JSX.Element {
  const { Icon, fill } = glyphs[isGlyphKey(glyphKey) ? glyphKey : 'generic']
  const repeat = Math.min(Math.max(Math.trunc(count), 1), 10)

  return (
    <span role="img" aria-label={`${glyphKey} × ${repeat}`} className={cn('inline-flex items-center gap-px align-middle', className)}>
      {Array.from({ length: repeat }, (_, index) => (
        <Icon key={index} aria-hidden className="size-[1em]" fill={fill ? 'currentColor' : 'none'} strokeWidth={fill ? 1.25 : 2} />
      ))}
    </span>
  )
}
