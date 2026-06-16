import { createRequire } from 'node:module'
import type { Lang } from '@methode-kuate/core'

const require = createRequire(import.meta.url)

let currentLang: Lang = 'fr'
let strings: Record<string, string> = {}

export function initI18n(lang: Lang): void {
  currentLang = lang
  strings =
    lang === 'fr'
      ? (require('./fr.json') as Record<string, string>)
      : (require('./en.json') as Record<string, string>)
}

export function t(key: string, vars?: Record<string, string | number>): string {
  let str = strings[key] ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`{{${k}}}`, 'g'), String(v))
    }
  }
  return str
}

export function getLang(): Lang {
  return currentLang
}
