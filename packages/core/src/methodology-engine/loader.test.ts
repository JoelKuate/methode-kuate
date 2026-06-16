import { describe, it, expect } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadMethodology } from './loader.js'
import { filterAgentsForMethodology } from './index.js'
import type { AgentDefinition } from '../types.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = path.resolve(__dirname, '../../../../templates')

const mockAgents: AgentDefinition[] = [
  {
    id: 'architecte-solution',
    name: 'Solution Architect',
    nameFr: 'Architecte Solution',
    domain: 'dev',
    phase: 'A',
    templateFile: 'architecte-solution.hbs',
    description: 'Designs systems',
    descriptionFr: 'Conçoit les systèmes',
  },
  {
    id: 'coach-agile',
    name: 'Agile Coach',
    nameFr: 'Coach Agile',
    domain: 'business',
    phase: 'U',
    templateFile: 'coach-agile.hbs',
    description: 'Coaches agile',
    descriptionFr: 'Coach agile',
  },
]

describe('loadMethodology', () => {
  it('charge la méthodologie agile depuis le YAML', async () => {
    const method = await loadMethodology('agile', TEMPLATES_DIR)
    expect(method.id).toBe('agile')
    expect(method.name).toBe('Agile/Scrum')
    expect(method.vocabulary.fr.iteration).toBe('sprint')
  })

  it('charge la méthodologie pmbok', async () => {
    const method = await loadMethodology('pmbok', TEMPLATES_DIR)
    expect(method.id).toBe('pmbok')
    expect(method.vocabulary.fr.deliverable).toBe('livrable')
  })

  it('lance une erreur pour une méthodologie inconnue', async () => {
    await expect(
      loadMethodology('unknown' as any, TEMPLATES_DIR)
    ).rejects.toThrow()
  })
})

describe('filterAgentsForMethodology', () => {
  it('filtre par domaine et méthodologie', async () => {
    const method = await loadMethodology('agile', TEMPLATES_DIR)
    const filtered = filterAgentsForMethodology(mockAgents, method, ['dev'])
    expect(filtered).toHaveLength(1)
    expect(filtered[0].id).toBe('architecte-solution')
  })

  it('retourne vide si domaine non inclus', async () => {
    const method = await loadMethodology('agile', TEMPLATES_DIR)
    const filtered = filterAgentsForMethodology(mockAgents, method, ['content'])
    expect(filtered).toHaveLength(0)
  })
})
