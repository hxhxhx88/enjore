// The glyph keys the marks registry draws. A tier may carry any key: an unknown one renders the generic mark, so a new
// award works before its drawing exists (see "Marks" in `docs/product/0000-project-overview.md`).
export const knownGlyphKeys = ['star', 'diamond', 'toque', 'fork', 'radish', 'pin', 'leaf', 'generic'] as const
export type GlyphKey = (typeof knownGlyphKeys)[number]

const known: ReadonlySet<string> = new Set(knownGlyphKeys)

export function isGlyphKey(key: string): key is GlyphKey {
  return known.has(key)
}
