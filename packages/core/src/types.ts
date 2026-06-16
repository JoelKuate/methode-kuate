export type { KuateConfig } from './config-manager/schema.js'
export type { MethodologyDefinition } from './methodology-engine/loader.js'

export type Lang = 'fr' | 'en'

export type MethodologyId =
  | 'agile'
  | 'lean'
  | 'pmbok'
  | 'safe'
  | 'okr'
  | 'design-thinking'
  | 'custom'

export type DomainId = 'dev' | 'business' | 'content' | 'education'

export type Phase = 'K' | 'U' | 'A' | 'T' | 'E'

export interface AgentDefinition {
  id: string
  name: string
  nameFr: string
  domain: DomainId
  phase: Phase
  templateFile: string
  description: string
  descriptionFr: string
}

export interface GeneratedAgent {
  id: string
  prompt: string
  lang: Lang
}
