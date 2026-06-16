import { describe, it, expect } from 'vitest'
import { renderAgentTemplate } from './renderer.js'
import type { MethodologyDefinition } from '../types.js'

const agileMethodology: MethodologyDefinition = {
  id: 'agile',
  name: 'Agile/Scrum',
  nameFr: 'Agile/Scrum',
  agentIds: ['architecte-solution'],
  workflowIds: ['sprint-planning'],
  vocabulary: {
    en: { iteration: 'sprint', deliverable: 'story' },
    fr: { iteration: 'sprint', deliverable: 'story' },
  },
}

describe('renderAgentTemplate', () => {
  it('injecte le nom du projet dans le template', () => {
    const template = 'Projet: {{projectName}}'
    const result = renderAgentTemplate(template, {
      agentName: 'Solution Architect',
      agentNameFr: 'Architecte Solution',
      projectName: 'MonAppli',
      lang: 'fr',
      methodology: agileMethodology,
      phase: 'A',
      description: 'Designs systems',
      descriptionFr: 'Conçoit les systèmes',
    })
    expect(result).toBe('Projet: MonAppli')
  })

  it('injecte le nom de méthodologie en français', () => {
    const template = 'Méthode: {{methodologyName}}'
    const result = renderAgentTemplate(template, {
      agentName: 'Solution Architect',
      agentNameFr: 'Architecte Solution',
      projectName: 'MonAppli',
      lang: 'fr',
      methodology: agileMethodology,
      phase: 'A',
      description: 'Designs systems',
      descriptionFr: 'Conçoit les systèmes',
    })
    expect(result).toBe('Méthode: Agile/Scrum')
  })

  it('expose isAgile=true pour méthodologie agile', () => {
    const template = '{{#if isAgile}}oui{{else}}non{{/if}}'
    const result = renderAgentTemplate(template, {
      agentName: 'x',
      agentNameFr: 'x',
      projectName: 'p',
      lang: 'fr',
      methodology: agileMethodology,
      phase: 'A',
      description: 'd',
      descriptionFr: 'd',
    })
    expect(result).toBe('oui')
  })

  it('sélectionne le vocabulaire FR quand lang=fr', () => {
    const template = '{{vocabulary.iteration}}'
    const result = renderAgentTemplate(template, {
      agentName: 'x',
      agentNameFr: 'x',
      projectName: 'p',
      lang: 'fr',
      methodology: agileMethodology,
      phase: 'A',
      description: 'd',
      descriptionFr: 'd',
    })
    expect(result).toBe('sprint')
  })
})
