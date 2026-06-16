import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import os from 'node:os'
import fs from 'fs-extra'
import {
  readConfig,
  writeConfig,
  initKuateStructure,
  isKuateProject,
  getKuateDir,
} from './index.js'
import type { KuateConfig } from '../types.js'

const sampleConfig: KuateConfig = {
  project: 'TestProjet',
  lang: 'fr',
  method: 'agile',
  domains: ['dev'],
  version: '1.0.0',
  agents: ['architecte-solution', 'dev-senior'],
}

let tmpDir: string

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'kuate-test-'))
})

afterEach(async () => {
  await fs.remove(tmpDir)
})

describe('isKuateProject', () => {
  it('retourne false si .kuate/config.yaml absent', () => {
    expect(isKuateProject(tmpDir)).toBe(false)
  })

  it('retourne true après initKuateStructure', async () => {
    await initKuateStructure(tmpDir, sampleConfig)
    expect(isKuateProject(tmpDir)).toBe(true)
  })
})

describe('writeConfig / readConfig', () => {
  it('écrit et relit une config identique', async () => {
    await fs.ensureDir(getKuateDir(tmpDir))
    await writeConfig(tmpDir, sampleConfig)
    const result = await readConfig(tmpDir)
    expect(result).toEqual(sampleConfig)
  })
})

describe('initKuateStructure', () => {
  it('crée tous les dossiers et fichiers de contexte', async () => {
    await initKuateStructure(tmpDir, sampleConfig)
    expect(fs.existsSync(path.join(tmpDir, '.kuate', 'agents'))).toBe(true)
    expect(fs.existsSync(path.join(tmpDir, '.kuate', 'context', 'memory.md'))).toBe(true)
    expect(fs.existsSync(path.join(tmpDir, '.kuate', 'context', 'architecture.md'))).toBe(true)
  })

  it('ne réécrase pas les fichiers de contexte existants', async () => {
    await initKuateStructure(tmpDir, sampleConfig)
    const memPath = path.join(tmpDir, '.kuate', 'context', 'memory.md')
    await fs.writeFile(memPath, '# Existing content\n\nsome data', 'utf-8')
    await initKuateStructure(tmpDir, sampleConfig)
    const content = await fs.readFile(memPath, 'utf-8')
    expect(content).toBe('# Existing content\n\nsome data')
  })
})

describe('readConfig errors', () => {
  it('lance une erreur si le projet KUATE est absent', async () => {
    await expect(readConfig(tmpDir)).rejects.toThrow('Lancez kuate init')
  })
})
