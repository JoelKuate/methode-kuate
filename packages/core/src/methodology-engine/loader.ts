import path from 'node:path'
import fs from 'fs-extra'
import { parse } from 'yaml'
import type { MethodologyDefinition, MethodologyId } from '../types.js'

export async function loadMethodology(
  methodologyId: MethodologyId,
  templatesDir: string
): Promise<MethodologyDefinition> {
  const filePath = path.join(templatesDir, 'methodology', `${methodologyId}.yaml`)

  if (!fs.existsSync(filePath)) {
    throw new Error(`Méthodologie "${methodologyId}" non trouvée dans ${templatesDir}`)
  }

  const raw = await fs.readFile(filePath, 'utf-8')
  return parse(raw) as MethodologyDefinition
}
