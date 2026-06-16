import { describe, it, expect } from 'vitest'
import { KuateConfigSchema } from './schema.js'

describe('KuateConfigSchema', () => {
  it('valide une config correcte', () => {
    const result = KuateConfigSchema.safeParse({
      project: 'MonAppli',
      lang: 'fr',
      method: 'agile',
      domains: ['dev'],
      version: '1.0.0',
      agents: ['architecte-solution'],
    })
    expect(result.success).toBe(true)
  })

  it('rejette une langue invalide', () => {
    const result = KuateConfigSchema.safeParse({
      project: 'MonAppli',
      lang: 'de',
      method: 'agile',
      domains: ['dev'],
      version: '1.0.0',
      agents: [],
    })
    expect(result.success).toBe(false)
  })

  it('rejette domains vide', () => {
    const result = KuateConfigSchema.safeParse({
      project: 'MonAppli',
      lang: 'fr',
      method: 'agile',
      domains: [],
      version: '1.0.0',
      agents: [],
    })
    expect(result.success).toBe(false)
  })
})
