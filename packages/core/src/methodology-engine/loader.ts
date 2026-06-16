import path from 'node:path'
import fs from 'fs-extra'
import { parse } from 'yaml'
import { z } from 'zod'
import type { MethodologyId } from '../types.js'

const VocabularySchema = z.record(z.string())

const MethodologyDefinitionSchema = z.object({
  id: z.enum(['agile', 'lean', 'pmbok', 'safe', 'okr', 'design-thinking', 'custom']),
  name: z.string().min(1),
  nameFr: z.string().min(1),
  agentIds: z.array(z.string()).min(1),
  workflowIds: z.array(z.string()),
  vocabulary: z.object({
    en: VocabularySchema,
    fr: VocabularySchema,
  }),
})

export type MethodologyDefinition = z.infer<typeof MethodologyDefinitionSchema>

export async function loadMethodology(
  methodologyId: MethodologyId,
  templatesDir: string
): Promise<MethodologyDefinition> {
  const filePath = path.join(templatesDir, 'methodology', `${methodologyId}.yaml`)

  if (!fs.existsSync(filePath)) {
    throw new Error(`Méthodologie "${methodologyId}" non trouvée dans ${templatesDir}`)
  }

  const raw = await fs.readFile(filePath, 'utf-8')
  const parsed = parse(raw)

  try {
    return MethodologyDefinitionSchema.parse(parsed)
  } catch (err) {
    throw new Error(`Fichier de méthodologie invalide (${filePath}): ${(err as Error).message}`)
  }
}
