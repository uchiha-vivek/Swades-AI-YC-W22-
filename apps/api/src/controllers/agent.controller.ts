import type { Context } from 'hono'

export class AgentController {
  static listAgents(c: Context) {
    return c.json(['support', 'order', 'billing'])
  }

  static getCapabilities(c: Context) {
    const type = c.req.param('type')
    const map: Record<string, string[]> = {
      support: ['faq', 'troubleshooting'],
      order: ['status', 'cancel'],
      billing: ['refund', 'invoice'],
    }
    return c.json(map[type] || [])
  }
}
