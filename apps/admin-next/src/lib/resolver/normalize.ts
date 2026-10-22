// Text reduced to what identity depends on, so "Tim Ho Wan (Central)" and "tim ho wan, central" compare equal:
// compatibility forms folded (fullwidth letters, ligatures), lowercase, and everything but letters, marks and digits
// removed. CJK characters are letters and stay.
export function normalizeName(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, '')
}

// Scripts written without spaces, where a run of characters is one "word" that would never match another. The second
// alternative stops at them, so a digit next to a Chinese character does not glue onto it.
const unspacedRun = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]+/u
const tokenPattern = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]+|(?:(?![\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}])[\p{L}\p{M}\p{N}])+/gu

// The tokens an address is compared by. The territory's own name says nothing about which venue it is, so "Hong
// Kong" and "香港" go first; Latin words are tokens, and a run of CJK characters becomes its character bigrams so
// Chinese addresses without spaces still overlap where they agree.
export function addressTokens(text: string): string[] {
  const lowered = text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/hong\s*kong/g, ' ')
    .replace(/香港/g, ' ')

  const tokens: string[] = []
  for (const match of lowered.matchAll(tokenPattern)) {
    const run = match[0]
    if (!unspacedRun.test(run)) {
      tokens.push(run)
      continue
    }
    const characters = Array.from(run)
    if (characters.length === 1) {
      tokens.push(run)
      continue
    }
    for (let i = 0; i + 1 < characters.length; i++) {
      tokens.push(`${characters[i]}${characters[i + 1]}`)
    }
  }
  return tokens
}
