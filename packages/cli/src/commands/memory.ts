import path from 'node:path'
import chalk from 'chalk'
import fs from 'fs-extra'
import * as p from '@clack/prompts'
import { readConfig, isKuateProject } from '@methode-kuate/core'
import { initI18n } from '../i18n/index.js'

const MEMORY_SECTIONS = ['memory', 'architecture', 'business', 'constraints', 'glossary'] as const
type MemorySection = typeof MEMORY_SECTIONS[number]

function getContextDir(cwd: string): string {
  return path.join(cwd, '.kuate', 'context')
}

function getSectionPath(cwd: string, section: MemorySection): string {
  return path.join(getContextDir(cwd), `${section}.md`)
}

export async function memoryShowCommand(cwd: string, section?: string): Promise<void> {
  if (!isKuateProject(cwd)) {
    console.error(chalk.red("Aucun projet KUATE trouvé. Lancez kuate init d'abord."))
    process.exit(1)
  }

  const config = await readConfig(cwd)
  initI18n(config.lang)

  const contextDir = getContextDir(cwd)

  if (section) {
    if (!MEMORY_SECTIONS.includes(section as MemorySection)) {
      console.error(chalk.red(`Section "${section}" inconnue. Sections valides : ${MEMORY_SECTIONS.join(', ')}`))
      process.exit(1)
    }
    const filePath = getSectionPath(cwd, section as MemorySection)
    if (!fs.existsSync(filePath)) {
      console.log(chalk.dim(`  La section "${section}" est vide.`))
      return
    }
    const content = await fs.readFile(filePath, 'utf-8')
    console.log()
    console.log(chalk.bold.hex('#6c63ff')(`  MÉMOIRE — ${section.toUpperCase()}`))
    console.log(chalk.dim('  ' + '─'.repeat(50)))
    console.log(content)
    return
  }

  console.log()
  console.log(chalk.bold.hex('#6c63ff')(`  MÉMOIRE KUATE — ${config.project}`))
  console.log()

  for (const sec of MEMORY_SECTIONS) {
    const filePath = path.join(contextDir, `${sec}.md`)
    if (!fs.existsSync(filePath)) continue
    const content = await fs.readFile(filePath, 'utf-8')
    const lines = content.trim().split('\n').length
    const preview = content.trim().split('\n').slice(0, 2).join(' ').substring(0, 80)
    console.log(`  ${chalk.green('●')} ${chalk.bold(sec.padEnd(16))} ${chalk.dim(`${lines} lignes`)}  ${chalk.dim(preview + '…')}`)
  }
  console.log()
  console.log(chalk.dim('  Tapez kuate memory show --section <nom> pour voir le détail'))
  console.log()
}

export async function memoryAddCommand(cwd: string, section: string): Promise<void> {
  if (!isKuateProject(cwd)) {
    console.error(chalk.red("Aucun projet KUATE trouvé. Lancez kuate init d'abord."))
    process.exit(1)
  }

  if (!MEMORY_SECTIONS.includes(section as MemorySection)) {
    console.error(chalk.red(`Section "${section}" inconnue. Sections valides : ${MEMORY_SECTIONS.join(', ')}`))
    process.exit(1)
  }

  const content = await p.text({
    message: `Contenu à ajouter dans "${section}" :`,
    validate: (v) => (v.trim().length === 0 ? 'Le contenu ne peut pas être vide' : undefined),
  })
  if (p.isCancel(content)) { p.cancel('Annulé'); process.exit(0) }

  const filePath = getSectionPath(cwd, section as MemorySection)
  const timestamp = new Date().toISOString().split('T')[0]
  const entry = `\n## ${timestamp}\n\n${String(content)}\n`

  await fs.appendFile(filePath, entry)
  p.log.success(chalk.green(`Entrée ajoutée dans .kuate/context/${section}.md`))
}

export async function memoryInjectCommand(cwd: string): Promise<void> {
  if (!isKuateProject(cwd)) {
    console.error(chalk.red("Aucun projet KUATE trouvé. Lancez kuate init d'abord."))
    process.exit(1)
  }

  const config = await readConfig(cwd)
  initI18n(config.lang)

  const contextDir = getContextDir(cwd)
  const sections: string[] = []

  for (const sec of MEMORY_SECTIONS) {
    const filePath = path.join(contextDir, `${sec}.md`)
    if (!fs.existsSync(filePath)) continue
    const content = (await fs.readFile(filePath, 'utf-8')).trim()
    if (!content) continue
    const lines = content.split('\n').slice(0, 5).join(' ').replace(/#+\s*/g, '').substring(0, 120)
    sections.push(`${sec.toUpperCase()}: ${lines}`)
  }

  const block = [
    `[CONTEXTE KUATE — ${config.project}]`,
    `Méthode: ${config.method} | Langue: ${config.lang.toUpperCase()} | Agents: ${config.agents.length}`,
    '',
    ...sections,
    '',
    '[FIN CONTEXTE]',
  ].join('\n')

  console.log()
  console.log(chalk.bold.hex('#6c63ff')('  BLOC CONTEXTE — Copier/Coller dans votre session IA'))
  console.log(chalk.dim('  ' + '─'.repeat(60)))
  console.log()
  console.log(chalk.cyan(block))
  console.log()
  console.log(chalk.dim('  Conseil : collez ce bloc au début de votre conversation IA'))
  console.log()
}
