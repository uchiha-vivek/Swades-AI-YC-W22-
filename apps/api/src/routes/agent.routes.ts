import { Hono } from 'hono'
import { AgentController } from '../controllers/agent.controller.js'
import { mockAuth } from '../middlewares/mockAuth.js'
import { chatRateLimiter } from '../middlewares/rateLimit.js'

export const agentRoutes = new Hono()

agentRoutes.use("*",mockAuth)
agentRoutes.use("*",chatRateLimiter)

agentRoutes.get('/', AgentController.listAgents)
agentRoutes.get('/:type/capabilities', AgentController.getCapabilities)
