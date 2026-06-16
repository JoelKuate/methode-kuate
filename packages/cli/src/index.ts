import { Command } from 'commander'
import { initI18n } from './i18n/index.js'
import { detectSystemLang } from './utils/lang.js'
import { initCommand } from './commands/init.js'
import { agentListCommand, agentUseCommand, agentInfoCommand } from './commands/agent.js'
import { configShowCommand } from './commands/config.js'

const VERSION = '1.0.0'
const cwd = process.cwd()

initI18n(detectSystemLang())

const program = new Command()

program
  .name('kuate')
  .description("Méthode KUATE — CLI d'orchestration d'agents IA")
  .version(VERSION)

program
  .command('init')
  .description('Initialise la Méthode KUATE dans le projet courant')
  .action(() => initCommand(cwd))

const agentCmd = program.command('agent').description('Gère les agents spécialisés')

agentCmd
  .command('list')
  .description('Liste tous les agents disponibles')
  .action(() => agentListCommand(cwd))

agentCmd
  .command('use <nom>')
  .description("Copie le prompt de l'agent dans le presse-papier")
  .action((nom: string) => agentUseCommand(cwd, nom))

agentCmd
  .command('info <nom>')
  .description("Affiche la fiche complète d'un agent")
  .action((nom: string) => agentInfoCommand(cwd, nom))

const configCmd = program.command('config').description('Gère la configuration .kuate/')

configCmd
  .command('show')
  .description('Affiche la configuration courante')
  .action(() => configShowCommand(cwd))

program.parse(process.argv)
