import type { Lang } from '@methode-kuate/core'

export function detectSystemLang(): Lang {
  const envLang = process.env['LANG'] ?? process.env['LANGUAGE'] ?? ''
  if (envLang.toLowerCase().startsWith('fr')) return 'fr'
  return 'en'
}
