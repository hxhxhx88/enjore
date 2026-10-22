import { addressTokens, normalizeName } from './normalize'

// The Dice coefficient over two bags of tokens: twice the overlap over the total. Empty bags carry no information
// and score 0.
function dice(a: readonly string[], b: readonly string[]): number {
  if (a.length === 0 || b.length === 0) {
    return 0
  }
  const counts = new Map<string, number>()
  for (const token of a) {
    counts.set(token, (counts.get(token) ?? 0) + 1)
  }
  let overlap = 0
  for (const token of b) {
    const count = counts.get(token) ?? 0
    if (count > 0) {
      overlap += 1
      counts.set(token, count - 1)
    }
  }
  return (2 * overlap) / (a.length + b.length)
}

function bigrams(text: string): string[] {
  const characters = Array.from(text)
  const result: string[] = []
  for (let i = 0; i + 1 < characters.length; i++) {
    result.push(`${characters[i]}${characters[i + 1]}`)
  }
  return result
}

// How alike two names are, from 0 to 1, over the character bigrams of their normalized forms. Equal normalized names
// score 1 even when too short for a bigram.
export function diceBigrams(a: string, b: string): number {
  const left = normalizeName(a)
  const right = normalizeName(b)
  if (left === right) {
    return left === '' ? 0 : 1
  }
  return dice(bigrams(left), bigrams(right))
}

// The best match between any name of one side and any name of the other: an entry's names against a restaurant's
// canonical and translated names.
export function nameSimilarity(a: readonly string[], b: readonly string[]): number {
  let best = 0
  for (const left of a) {
    for (const right of b) {
      best = Math.max(best, diceBigrams(left, right))
    }
  }
  return best
}

// Token Dice over the address tokens, so word order and punctuation do not matter.
export function addressSimilarity(a: string, b: string): number {
  return dice(addressTokens(a), addressTokens(b))
}
