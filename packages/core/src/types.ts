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

export interface KuateConfig {
  project: string
  lang: Lang
  method: MethodologyId
  domains: DomainId[]
  version: string
  agents: string[]
}

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

export interface MethodologyDefinition {
  id: MethodologyId
  name: string
  nameFr: string
  agentIds: string[]
  workflowIds: string[]
  vocabulary: {
    en: Record<string, string>
    fr: Record<string, string>
  }
}

export interface GeneratedAgent {
  id: string
  prompt: string
  lang: Lang
}
