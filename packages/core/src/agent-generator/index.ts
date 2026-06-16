import path from 'node:path'
import fs from 'fs-extra'
import { renderAgentTemplate } from './renderer.js'
import type { AgentDefinition, GeneratedAgent, KuateConfig, MethodologyDefinition } from '../types.js'

export interface GenerateOptions {
  agent: AgentDefinition
  config: KuateConfig
  methodology: MethodologyDefinition
  templatesDir: string
}

export interface GenerateAndSaveOptions extends GenerateOptions {
  outputDir: string
}

export async function generateAgent(options: GenerateOptions): Promise<GeneratedAgent> {
  const { agent, config, methodology, templatesDir } = options
  const templatePath = path.join(templatesDir, agent.templateFile)

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template introuvable : ${templatePath}`)
  }

  const templateSource = await fs.readFile(templatePath, 'utf-8')
  const prompt = renderAgentTemplate(templateSource, {
    agentName: agent.name,
    agentNameFr: agent.nameFr,
    projectName: config.project,
    lang: config.lang,
    methodology,
    phase: agent.phase,
    description: agent.description,
    descriptionFr: agent.descriptionFr,
  })

  return { id: agent.id, prompt, lang: config.lang }
}

export async function generateAndSaveAgent(
  options: GenerateAndSaveOptions
): Promise<GeneratedAgent> {
  const generated = await generateAgent(options)
  const outputPath = path.join(options.outputDir, `${generated.id}.md`)
  await fs.ensureDir(options.outputDir)
  await fs.writeFile(outputPath, generated.prompt, 'utf-8')
  return generated
}
