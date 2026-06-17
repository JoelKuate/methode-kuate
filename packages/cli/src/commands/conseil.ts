import path from 'node:path'
import chalk from 'chalk'
import fs from 'fs-extra'
import * as p from '@clack/prompts'
import { readConfig, isKuateProject } from '@methode-kuate/core'
import { AGENTS_DEV } from '@methode-kuate/agents-dev'
import { AGENTS_BUSINESS } from '@methode-kuate/agents-business'
import { AGENTS_CONTENT } from '@methode-kuate/agents-content'
import { AGENTS_EDUCATION } from '@methode-kuate/agents-education'
import type { AgentDefinition } from '@methode-kuate/core'
import { initI18n } from '../i18n/index.js'

const ALL_AGENTS: AgentDefinition[] = [
  ...AGENTS_DEV,
  ...AGENTS_BUSINESS,
  ...AGENTS_CONTENT,
  ...AGENTS_EDUCATION,
]

export async function conseilCommand(
  cwd: string,
  agentNames: string[],
  topic: string,
  save: boolean
): Promise<void> {
  if (!isKuateProject(cwd)) {
    console.error(chalk.red('Aucun projet KUATE trouvé. Lancez kuate init d\'abord.'))
    process.exit(1)
  }

  const config = await readConfig(cwd)
  initI18n(config.lang)

  // Resolve agents
  const resolvedAgents = agentNames
    .map(name => ALL_AGENTS.find(a => a.id === name))
    .filter((a): a is AgentDefinition => a !== undefined)

  if (resolvedAgents.length === 0) {
    console.error(chalk.red(`Aucun agent valide. Agents disponibles : kuate agent list`))
    process.exit(1)
  }

  // Load prompts
  const agentsDir = path.join(cwd, '.kuate', 'agents')
  const agentPrompts: { agent: AgentDefinition; prompt: string }[] = []

  for (const agent of resolvedAgents) {
    const promptPath = path.join(agentsDir, `${agent.id}.md`)
    if (!fs.existsSync(promptPath)) {
      console.warn(chalk.yellow(`  Agent "${agent.id}" non généré — ignoré`))
      continue
    }
    const prompt = await fs.readFile(promptPath, 'utf-8')
    agentPrompts.push({ agent, prompt })
  }

  if (agentPrompts.length === 0) {
    console.error(chalk.red('Aucun prompt d\'agent disponible. Relancez kuate init.'))
    process.exit(1)
  }

  // Build conseil block
  const conseil = buildConseilBlock(agentPrompts, topic, config.project)

  console.log()
  console.log(chalk.bold.hex('#6c63ff')('  SESSION CONSEIL KUATE'))
  console.log(chalk.dim('  ' + '─'.repeat(60)))
  console.log()
  console.log(chalk.bold(`  Sujet    : ${topic}`))
  console.log(chalk.bold(`  Agents   : ${agentPrompts.map(a => chalk.cyan(a.agent.id)).join(' · ')}`))
  console.log(chalk.bold(`  Projet   : ${config.project}`))
  console.log()
  console.log(chalk.dim('  ┌─ Prompt Conseil ─────────────────────────────────────────┐'))
  console.log()

  // Print first 20 lines with indentation
  const previewLines = conseil.split('\n').slice(0, 20)
  for (const line of previewLines) {
    console.log(`  ${chalk.dim('│')} ${line}`)
  }
  if (conseil.split('\n').length > 20) {
    console.log(`  ${chalk.dim('│')} ${chalk.dim(`... (${conseil.split('\n').length - 20} lignes supplémentaires)`)}`)
  }

  console.log()
  console.log(chalk.dim('  └──────────────────────────────────────────────────────────┘'))
  console.log()

  if (save) {
    const archFile = path.join(cwd, '.kuate', 'context', 'architecture.md')
    const timestamp = new Date().toISOString().split('T')[0]
    const entry = `\n## Session Conseil — ${timestamp}\n\n**Sujet :** ${topic}\n\n**Agents :** ${agentPrompts.map(a => a.agent.id).join(', ')}\n\n`
    await fs.appendFile(archFile, entry)
    p.log.success(chalk.green(`Session sauvegardée dans .kuate/context/architecture.md`))
  }

  console.log(chalk.dim(`  Collez ce prompt dans Claude, ChatGPT ou Gemini pour obtenir`))
  console.log(chalk.dim(`  une réponse multi-experts sur le sujet.`))
  console.log()
}

function buildConseilBlock(
  agentPrompts: { agent: AgentDefinition; prompt: string }[],
  topic: string,
  projectName: string
): string {
  const agentSections = agentPrompts.map(({ agent, prompt }) => {
    const header = `=== ${agent.nameFr.toUpperCase()} (${agent.id}) ===`
    const excerpt = prompt.split('\n').slice(0, 15).join('\n')
    return `${header}\n${excerpt}`
  }).join('\n\n')

  return [
    `# SESSION CONSEIL KUATE — ${projectName}`,
    ``,
    `**Sujet de la session :** ${topic}`,
    ``,
    `**Instructions :**`,
    `Vous êtes une équipe de ${agentPrompts.length} experts convoqués pour donner votre avis sur ce sujet.`,
    `Chaque expert doit répondre depuis son angle de spécialité.`,
    `À la fin, synthétisez les points de convergence et les points de tension.`,
    ``,
    `## Profils des Experts`,
    ``,
    agentSections,
    ``,
    `## Question`,
    ``,
    topic,
    ``,
    `## Format de Réponse Attendu`,
    ``,
    `Pour chaque expert :`,
    `**[Nom de l'expert]** — [Avis depuis son angle de spécialité, 3-5 phrases]`,
    ``,
    `**Synthèse :**`,
    `- Points de convergence`,
    `- Points de tension / désaccords`,
    `- Recommandation finale`,
  ].join('\n')
}
