import Handlebars from 'handlebars'
import type { Lang, MethodologyDefinition } from '../types.js'

Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b)

export interface AgentTemplateContext {
  agentName: string
  agentNameFr: string
  projectName: string
  lang: Lang
  methodology: MethodologyDefinition
  phase: string
  description: string
  descriptionFr: string
}

export function renderAgentTemplate(
  templateSource: string,
  context: AgentTemplateContext
): string {
  const template = Handlebars.compile(templateSource)

  const methodologyName =
    context.lang === 'fr'
      ? context.methodology.nameFr
      : context.methodology.name

  const vocabulary =
    context.lang === 'fr'
      ? context.methodology.vocabulary.fr
      : context.methodology.vocabulary.en

  return template({
    ...context,
    methodologyName,
    vocabulary,
    isAgile: context.methodology.id === 'agile',
    isPmbok: context.methodology.id === 'pmbok',
    isLean: context.methodology.id === 'lean',
    isDesignThinking: context.methodology.id === 'design-thinking',
  })
}
