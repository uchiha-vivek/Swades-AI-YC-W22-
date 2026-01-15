import { generateObject } from 'ai'
import { z } from 'zod'
import { ollama } from '../ai/ollama'
import type { Intent } from '../types/intent.types'
import { SupportAgent } from './support.agent'
import { OrderAgent } from './order.agent'
import { BillingAgent } from './billing.agent'

const IntentSchema = z.object({
  intent: z.enum([
    'support.general',
    'order.status',
    'order.cancel',
    'billing.invoice',
    'billing.refund',
    'unknown',
  ]),
})

export class RouterAgent {
  private static async classifyIntent(message: string): Promise<Intent> {
    try {
      const result = await generateObject({
        model: ollama('gemma3:latest'),
        schema: IntentSchema,
        prompt: `
You are a router agent for a customer support system.

Classify the user's intent into EXACTLY ONE of the following:
- support.general
- order.status
- order.cancel
- billing.invoice
- billing.refund
- unknown

User message:
"${message}"

Return ONLY a JSON object matching this schema:
{ "intent": "<one_of_the_allowed_values>" }
        `,
      })

      return result.object.intent
    } catch (error) {
      // 🔒 Safety fallback (important for local models)
      console.error('RouterAgent AI failed, using fallback:', error)

      const msg = message.toLowerCase()
      if (msg.includes('order')) return 'order.status'
      if (msg.includes('invoice') || msg.includes('payment'))
        return 'billing.invoice'
      return 'support.general'
    }
  }

  static async route(input: {
    userId: string
    conversationId: string
    message: string
  }) {
    const intent = await this.classifyIntent(input.message)

    switch (intent) {
      case 'order.status':
      case 'order.cancel':
        return OrderAgent.handle(input)

      case 'billing.invoice':
      case 'billing.refund':
        return BillingAgent.handle(input)

      case 'support.general':
      default:
        return SupportAgent.handle(input)
    }
  }
}
