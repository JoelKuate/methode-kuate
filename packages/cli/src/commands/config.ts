import chalk from 'chalk'
import { readConfig, isKuateProject } from '@methode-kuate/core'
import { initI18n, t } from '../i18n/index.js'

export async function configShowCommand(cwd: string): Promise<void> {
  if (!isKuateProject(cwd)) {
    console.error(chalk.red(t('error.notKuateProject')))
    process.exit(1)
  }

  const config = await readConfig(cwd)
  initI18n(config.lang)

  console.log()
  console.log(chalk.bold.hex('#6c63ff')(`  ${t('config.show.header')}`))
  console.log(chalk.dim('  ' + '─'.repeat(40)))
  console.log(`  ${chalk.dim('project')}   ${chalk.bold(config.project)}`)
  console.log(`  ${chalk.dim('lang')}      ${chalk.cyan(config.lang)}`)
  console.log(`  ${chalk.dim('method')}    ${chalk.green(config.method)}`)
  console.log(`  ${chalk.dim('domains')}   ${config.domains.join(', ')}`)
  console.log(`  ${chalk.dim('version')}   ${config.version}`)
  console.log(`  ${chalk.dim('agents')}    ${config.agents.length} installés`)
  console.log()
}
