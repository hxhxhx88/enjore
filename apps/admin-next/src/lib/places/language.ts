// Every fact is requested in English for every record, so district values stay consistent across restaurants and
// the filters group them; other languages become translation rows later.
export const factsLanguageCode = 'en'

// Script subtags Google does not take; it wants a region that implies the script.
const chineseScripts: Readonly<Record<string, string>> = {
  hans: 'CN',
  hant: 'TW',
}

// The language the text search runs in: that of the canonical name, so the result's display name is written in the
// same script as the name it is compared with. Chinese needs its region to pick a script; other languages are
// requested by their language alone.
export function searchLanguageCode(locale: string): string {
  const [language = 'en', subtag] = locale.split('-')
  if (language === 'zh' && subtag !== undefined) {
    return `zh-${chineseScripts[subtag] ?? subtag.toUpperCase()}`
  }
  return language
}
