import { z } from 'zod'

export const KuateConfigSchema = z.object({
  project: z.string().min(1),
  lang: z.enum(['fr', 'en']),
  method: z.enum(['agile', 'lean', 'pmbok', 'safe', 'okr', 'design-thinking', 'custom']),
  domains: z.array(z.enum(['dev', 'business', 'content', 'education'])).min(1),
  version: z.string(),
  agents: z.array(z.string()),
})

export type KuateConfigInput = z.input<typeof KuateConfigSchema>
