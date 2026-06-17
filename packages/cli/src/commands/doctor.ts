import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { isKuateProject, readConfig } from '@methode-kuate/core'

interface Check {
  label: string
  status: 'ok' | 'warn' | 'error'
  detail?: string
}

function nodeVersion(): Check {
  const version = process.version
  const major = parseInt(version.slice(1).split('.')[0], 10)
  if (major >= 20) return { label: 'Node.js >= 20', status: 'ok', detail: version }
  return { label: 'Node.js >= 20', status: 'error', detail: `${version} — mettez à jour Node.js` }
}

function npmVersion(): Check {
  try {
    const version = execSync('npm --version', { encoding: 'utf-8' }).trim()
    const major = parseInt(version.split('.')[0], 10)
    if (major >= 9) return { label: 'npm >= 9', status: 'ok', detail: `v${version}` }
    return { label: 'npm >= 9', status: 'warn', detail: `v${version} — npm install -g npm@latest recommandé` }
  } catch {
    return { label: 'npm >= 9', status: 'error', detail: 'npm introuvable' }
  }
}

function kuateProject(cwd: string): Check {
  if (isKuateProject(cwd)) return { label: '.kuate/ présent', status: 'ok' }
  return { label: '.kuate/ présent', status: 'warn', detail: 'Lancez kuate init pour initialiser' }
}

async function configValid(cwd: string): Promise<Check> {
  if (!isKuateProject(cwd)) return { label: 'config.yaml valide', status: 'warn', detail: 'Projet non initialisé' }
  try {
    const config = await readConfig(cwd)
    return { label: 'config.yaml valide', status: 'ok', detail: `projet: ${config.project}, méthode: ${config.method}` }
  } catch (e) {
    return { label: 'config.yaml valide', status: 'error', detail: String(e) }
  }
}

function agentsPresent(cwd: string): Check {
  const agentsDir = path.join(cwd, '.kuate', 'agents')
  if (!fs.existsSync(agentsDir)) return { label: 'Agents générés', status: 'warn', detail: 'kuate init requis' }
  const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'))
  if (files.length === 0) return { label: 'Agents générés', status: 'warn', detail: 'Aucun agent trouvé' }
  return { label: 'Agents générés', status: 'ok', detail: `${files.length} agent(s)` }
}

function contextPresent(cwd: string): Check {
  const contextDir = path.join(cwd, '.kuate', 'context')
  if (!fs.existsSync(contextDir)) return { label: 'Contexte .kuate/context/', status: 'warn', detail: 'kuate init requis' }
  return { label: 'Contexte .kuate/context/', status: 'ok' }
}

function printCheck(check: Check): void {
  const icon = check.status === 'ok' ? chalk.green('✓') : check.status === 'warn' ? chalk.yellow('⚠') : chalk.red('✗')
  const label = chalk.bold(check.label.padEnd(30))
  const detail = check.detail ? chalk.dim(check.detail) : ''
  console.log(`  ${icon} ${label} ${detail}`)
}

export async function doctorCommand(cwd: string): Promise<void> {
  console.log()
  console.log(chalk.bold.hex('#6c63ff')('  KUATE DOCTOR — Diagnostic du projet'))
  console.log(chalk.dim('  ' + '─'.repeat(55)))
  console.log()

  const checks: Check[] = [
    nodeVersion(),
    npmVersion(),
    kuateProject(cwd),
    await configValid(cwd),
    agentsPresent(cwd),
    contextPresent(cwd),
  ]

  for (const check of checks) printCheck(check)

  console.log()
  const errors = checks.filter(c => c.status === 'error').length
  const warnings = checks.filter(c => c.status === 'warn').length

  if (errors === 0 && warnings === 0) {
    console.log(chalk.green('  Tout est en ordre. ✓'))
  } else {
    if (errors > 0) console.log(chalk.red(`  ${errors} erreur(s) à corriger`))
    if (warnings > 0) console.log(chalk.yellow(`  ${warnings} avertissement(s)`))
  }
  console.log()
}
