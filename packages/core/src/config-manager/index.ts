import path from 'node:path'
import fs from 'fs-extra'
import { parse, stringify } from 'yaml'
import { KuateConfigSchema } from './schema.js'
import type { KuateConfig } from '../types.js'

const KUATE_DIR = '.kuate'
const CONFIG_FILE = 'config.yaml'

export function getKuateDir(cwd: string): string {
  return path.join(cwd, KUATE_DIR)
}

export function getConfigPath(cwd: string): string {
  return path.join(getKuateDir(cwd), CONFIG_FILE)
}

export function isKuateProject(cwd: string): boolean {
  return fs.existsSync(getConfigPath(cwd))
}

export async function readConfig(cwd: string): Promise<KuateConfig> {
  const configPath = getConfigPath(cwd)
  if (!fs.existsSync(configPath)) {
    throw new Error(`Aucun projet KUATE trouvé dans ${cwd}. Lancez kuate init.`)
  }
  const raw = await fs.readFile(configPath, 'utf-8')
  let parsed: unknown
  try {
    parsed = parse(raw)
  } catch (err) {
    throw new Error(`Config YAML invalide dans ${configPath}: ${(err as Error).message}`)
  }
  try {
    return KuateConfigSchema.parse(parsed)
  } catch (err) {
    throw new Error(`Config invalide dans ${configPath}: ${(err as Error).message}`)
  }
}

export async function writeConfig(cwd: string, config: KuateConfig): Promise<void> {
  const kuateDir = getKuateDir(cwd)
  await fs.ensureDir(kuateDir)
  const configPath = getConfigPath(cwd)
  await fs.writeFile(configPath, stringify(config), 'utf-8')
}

export async function initKuateStructure(cwd: string, config: KuateConfig): Promise<void> {
  const kuateDir = getKuateDir(cwd)
  await fs.ensureDir(path.join(kuateDir, 'agents'))
  await fs.ensureDir(path.join(kuateDir, 'workflows'))
  await fs.ensureDir(path.join(kuateDir, 'context'))

  const contextFiles = ['memory.md', 'architecture.md', 'business.md', 'constraints.md', 'glossary.md']
  for (const file of contextFiles) {
    const filePath = path.join(kuateDir, 'context', file)
    if (!fs.existsSync(filePath)) {
      await fs.writeFile(filePath, `# ${file.replace('.md', '')}\n\n`, 'utf-8')
    }
  }

  await writeConfig(cwd, config)
}
