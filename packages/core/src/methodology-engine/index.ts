export { loadMethodology } from './loader.js'

import type { AgentDefinition, MethodologyDefinition, DomainId } from '../types.js'

export function filterAgentsForMethodology(
  agents: AgentDefinition[],
  methodology: MethodologyDefinition,
  domains: DomainId[]
): AgentDefinition[] {
  return agents.filter(
    (agent) =>
      domains.includes(agent.domain) &&
      methodology.agentIds.includes(agent.id)
  )
}
