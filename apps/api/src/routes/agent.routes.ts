import { Hono } from 'hono'
import { AgentController } from '../controllers/agent.controller.js'

export const agentRoutes = new Hono()

agentRoutes.get('/', AgentController.listAgents)
agentRoutes.get('/:type/capabilities', AgentController.getCapabilities)
