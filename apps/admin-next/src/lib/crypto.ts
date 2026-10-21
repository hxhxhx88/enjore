import { createHash, timingSafeEqual } from 'node:crypto'

// Compare hashes so the comparison runs in constant time regardless of input length.
export function secureEquals(a: string, b: string): boolean {
  return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest())
}
