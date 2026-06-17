import path from 'node:path'
import { fileURLToPath } from 'node:url'
import chalk from 'chalk'
import fs from 'fs-extra'
import ora from 'ora'
import { readConfig, isKuateProject } from '@methode-kuate/core'
import { initI18n } from '../i18n/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

type BuildTarget = 'claude' | 'chatgpt' | 'gemini' | 'cursor' | 'copilot' | 'pack'

async function readAgentPrompts(cwd: string, agentIds: string[]): Promise<string> {
  const agentsDir = path.join(cwd, '.kuate', 'agents')
  const parts: string[] = []
  for (const id of agentIds) {
    const file = path.join(agentsDir, `${id}.md`)
    if (fs.existsSync(file)) {
      parts.push(await fs.readFile(file, 'utf-8'))
    }
  }
  return parts.join('\n\n---\n\n')
}

async function buildClaude(cwd: string, config: Awaited<ReturnType<typeof readConfig>>): Promise<string> {
  const prompts = await readAgentPrompts(cwd, config.agents)
  return [
    `# CLAUDE.md — ${config.project}`,
    ``,
    `> Généré par Méthode KUATE · Méthode: ${config.method} · Langue: ${config.lang}`,
    ``,
    `## Agents Actifs`,
    ``,
    prompts,
  ].join('\n')
}

async function buildChatGPT(cwd: string, config: Awaited<ReturnType<typeof readConfig>>): Promise<string> {
  const prompts = await readAgentPrompts(cwd, config.agents)
  return JSON.stringify({
    name: `KUATE — ${config.project}`,
    description: `Agents Méthode KUATE pour ${config.project} (${config.method})`,
    instructions: prompts,
    model: 'gpt-4o',
  }, null, 2)
}

async function buildCursor(cwd: string, config: Awaited<ReturnType<typeof readConfig>>): Promise<string> {
  const prompts = await readAgentPrompts(cwd, config.agents)
  return [
    `# .cursorrules — ${config.project}`,
    `# Méthode KUATE · ${config.method} · ${config.lang}`,
    ``,
    prompts,
  ].join('\n')
}

async function buildCopilot(cwd: string, config: Awaited<ReturnType<typeof readConfig>>): Promise<string> {
  const prompts = await readAgentPrompts(cwd, config.agents)
  return [
    `# GitHub Copilot Instructions — ${config.project}`,
    `# Méthode KUATE · ${config.method}`,
    ``,
    prompts,
  ].join('\n')
}

async function buildGemini(cwd: string, config: Awaited<ReturnType<typeof readConfig>>): Promise<string> {
  const prompts = await readAgentPrompts(cwd, config.agents)
  return [
    `# Gemini Gem — ${config.project}`,
    `# Méthode KUATE · ${config.method} · ${config.lang}`,
    ``,
    prompts,
  ].join('\n')
}

export async function buildCommand(cwd: string, target: string): Promise<void> {
  if (!isKuateProject(cwd)) {
    console.error(chalk.red("Aucun projet KUATE trouvé. Lancez kuate init d'abord."))
    process.exit(1)
  }

  const validTargets: BuildTarget[] = ['claude', 'chatgpt', 'gemini', 'cursor', 'copilot', 'pack']
  if (!validTargets.includes(target as BuildTarget)) {
    console.error(chalk.red(`Cible "${target}" inconnue. Cibles valides : ${validTargets.join(', ')}`))
    process.exit(1)
  }

  const config = await readConfig(cwd)
  initI18n(config.lang)

  const spin = ora(`Export pour ${target}...`).start()

  const TARGET_CONFIGS: Record<BuildTarget, { filename: string; subdir?: string }> = {
    claude: { filename: 'CLAUDE.md' },
    chatgpt: { filename: 'chatgpt-instructions.json' },
    gemini: { filename: 'gemini-gem.md' },
    cursor: { filename: '.cursorrules' },
    copilot: { filename: 'copilot-instructions.md', subdir: '.github' },
    pack: { filename: `kuate-pack-${config.project}.md` },
  }

  const tc = TARGET_CONFIGS[target as BuildTarget]
  const outputDir = tc.subdir ? path.join(cwd, tc.subdir) : cwd
  await fs.ensureDir(outputDir)
  const outputPath = path.join(outputDir, tc.filename)

  let content: string
  switch (target as BuildTarget) {
    case 'claude': content = await buildClaude(cwd, config); break
    case 'chatgpt': content = await buildChatGPT(cwd, config); break
    case 'cursor': content = await buildCursor(cwd, config); break
    case 'copilot': content = await buildCopilot(cwd, config); break
    case 'gemini': content = await buildGemini(cwd, config); break
    case 'pack': content = await buildClaude(cwd, config); break
  }

  await fs.writeFile(outputPath, content, 'utf-8')

  spin.succeed(chalk.green(`Export ${target} → ${chalk.bold(path.relative(cwd, outputPath))}`))
  console.log()
  console.log(chalk.dim(`  Fichier : ${outputPath}`))
  console.log(chalk.dim(`  Agents  : ${config.agents.length}`))
  console.log(chalk.dim(`  Méthode : ${config.method}`))
  console.log()
}
