// Letters that NFKD leaves undecomposed; every other Latin letter reduces to a base letter plus combining marks.
const fallbacks: Readonly<Record<string, string>> = {
  ß: 'ss',
  æ: 'ae',
  œ: 'oe',
  ø: 'o',
  ð: 'd',
  þ: 'th',
  ł: 'l',
  đ: 'd',
}

// A URL slug from a Latin-script name. Non-Latin input, such as a Chinese name, yields an empty string, and the form
// then requires the operator to type one.
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[ßæœøðþłđ]/g, c => fallbacks[c] ?? c)
    // "Asia's" becomes "asias", not "asia-s".
    .replace(/['’ʼ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// The first name written in Latin script, in the caller's order (canonical name first, then its translations).
// Digits alone do not count as Latin script.
export function firstLatinName(names: readonly string[]): string | undefined {
  return names.find(name => /\p{Script=Latin}/u.test(name))
}
