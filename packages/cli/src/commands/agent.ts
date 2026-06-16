import path from 'node:path'
import * as p from '@clack/prompts'
import chalk from 'chalk'
import clipboard from 'clipboardy'
import fs from 'fs-extra'
import { readConfig, isKuateProject } from '@methode-kuate/core'
import { AGENTS_DEV } from '@methode-kuate/agents-dev'
import type { AgentDefinition } from '@methode-kuate/core'
import { initI18n, t } from '../i18n/index.js'

const ALL_AGENTS: AgentDefinition[] = [...AGENTS_DEV]

const PHASE_COLORS: Record<string, (s: string) => string> = {
  K: chalk.hex('#3b5bdb'),
  U: chalk.hex('#2f9e44'),
  A: chalk.hex('#e67700'),
  T: chalk.hex('#ae3ec9'),
  E: chalk.hex('#0ca678'),
}

export async function agentListCommand(cwd: string): Promise<void> {
  if (!isKuateProject(cwd)) {
    console.error(chalk.red(t('error.notKuateProject')))
    process.exit(1)
  }

  const config = await readConfig(cwd)
  initI18n(config.lang)

  const installedIds = new Set(config.agents)
  const installedAgents = ALL_AGENTS.filter((a) => installedIds.has(a.id))

  const byDomain = installedAgents.reduce<Record<string, AgentDefinition[]>>((acc, agent) => {
    acc[agent.domain] ??= []
    acc[agent.domain].push(agent)
    return acc
  }, {})

  console.log()
  console.log(chalk.bold.hex('#6c63ff')(`  ${t('agent.list.header')}`))
  console.log()

  const domainKeys = ['dev', 'business', 'content', 'education'] as const
  const domainLabels: Record<string, string> = {
    dev: t('agent.list.domain.dev'),
    business: t('agent.list.domain.business'),
    content: t('agent.list.domain.content'),
    education: t('agent.list.domain.education'),
  }

  for (const domain of domainKeys) {
    const agents = byDomain[domain]
    if (!agents?.length) continue

    console.log(chalk.dim(`  ${domainLabels[domain]}`))
    console.log(chalk.dim('  ' + '─'.repeat(55)))

    for (const agent of agents) {
      const phaseColor = PHASE_COLORS[agent.phase] ?? chalk.white
      const desc = config.lang === 'fr' ? agent.descriptionFr : agent.description
      console.log(
        `  ${chalk.green('●')} ${chalk.bold(agent.id.padEnd(28))} ${phaseColor(agent.phase)}  ${chalk.dim(desc)}`
      )
    }
    console.log()
  }

  console.log(chalk.dim(`  Tapez ${chalk.hex('#6c63ff')('kuate agent use <nom>')} pour utiliser un agent`))
  console.log()
}

export async function agentUseCommand(cwd: string, agentId: string): Promise<void> {
  if (!isKuateProject(cwd)) {
    console.error(chalk.red(t('error.notKuateProject')))
    process.exit(1)
  }

  const config = await readConfig(cwd)
  initI18n(config.lang)

  const agentDef = ALL_AGENTS.find((a) => a.id === agentId)
  if (!agentDef) {
    console.error(chalk.red(t('agent.notFound', { name: agentId })))
    process.exit(1)
  }

  const promptPath = path.join(cwd, '.kuate', 'agents', `${agentId}.md`)
  if (!fs.existsSync(promptPath)) {
    console.error(chalk.red(`Agent "${agentId}" non généré. Relancez kuate init.`))
    process.exit(1)
  }

  const promptContent = await fs.readFile(promptPath, 'utf-8')
  await clipboard.write(promptContent)

  const name = config.lang === 'fr' ? agentDef.nameFr : agentDef.name
  p.log.success(chalk.green(t('agent.use.copied', { name })))
  console.log()
  console.log(chalk.dim('  ┌─ Aperçu ─────────────────────────────────────────────────┐'))
  const preview = promptContent.split('\n').slice(0, 3).join('\n  │ ')
  console.log(`  │ ${chalk.italic.dim(preview)}`)
  console.log(chalk.dim('  └──────────────────────────────────────────────────────────┘'))
  console.log()
  console.log(chalk.dim(`  → ${t('agent.use.hint')}`))
  console.log()
}

export async function agentInfoCommand(cwd: string, agentId: string): Promise<void> {
  const agentDef = ALL_AGENTS.find((a) => a.id === agentId)
  if (!agentDef) {
    console.error(chalk.red(`Agent "${agentId}" introuvable.`))
    process.exit(1)
  }

  const phaseColor = PHASE_COLORS[agentDef.phase] ?? chalk.white
  console.log()
  console.log(chalk.bold(`  ${agentDef.nameFr} / ${agentDef.name}`))
  console.log(chalk.dim(`  ID: ${agentDef.id}`))
  console.log(`  Phase KUATE : ${phaseColor(agentDef.phase)}`)
  console.log(`  Domaine : ${chalk.cyan(agentDef.domain)}`)
  console.log(`  FR : ${agentDef.descriptionFr}`)
  console.log(`  EN : ${agentDef.description}`)
  console.log()
}
