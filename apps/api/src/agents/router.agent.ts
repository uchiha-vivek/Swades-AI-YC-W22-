import { OrderAgent } from './order.agent.js'
import { BillingAgent } from './billing.agent.js'
import { ProfileAgent } from './profile.agent.js'
import { logger } from '../lib/logger.js'

import { generateObject } from 'ai'
import { azure } from '../ai/ollama.js'
import { z } from 'zod'

type AgentInput = {
  userId: string
  conversationId?: string
  message: string
}

type AgentResult =
  | { type: 'tool'; content: string }
  | { type: 'llm'; prompt: string }

// defining 4 criteria now
const IntentSchema = z.object({
  intent: z.enum(['order', 'billing', 'profile', 'support']),
})

type Intent = z.infer<typeof IntentSchema>['intent']


// included prompt for intent classifications
async function detectIntentWithLLM(message: string): Promise<Intent> {
  try {
    const result = await generateObject({
      model: azure('gpt-4o-mini'),
      temperature: 0,
      schema: IntentSchema,
      system: `
        You are an intent classification engine.

        Choose exactly ONE intent from this list:
        - order: orders, delivery, tracking
        - billing: invoices, payments, refunds
        - profile: email, username, account details
        - support: everything else

        Rules:
        - Output ONLY valid JSON
        - Do NOT explain
        - Do NOT add extra fields
`,
      prompt: message,
    })

    return result.object.intent
  } catch (error) {
    logger.error({ error }, 'Intent classification failed')
    return 'support'
  }
}

export class RouterAgent {
  static async handle(input: AgentInput): Promise<AgentResult> {
    const intent = await detectIntentWithLLM(input.message)

    logger.info({
      intent,
      userId: input.userId,
      conversationId: input.conversationId ?? null,
    })

    switch (intent) {
      case 'order': {
        logger.info({ agent: 'OrderAgent' }, 'Tool selected')
        return {
          type: 'tool',
          content: await OrderAgent.handle(input),
        }
      }

      case 'billing': {
        logger.info({ agent: 'BillingAgent' }, 'Tool selected')
        return {
          type: 'tool',
          content: await BillingAgent.handle(input),
        }
      }

      case 'profile': {
        logger.info({ agent: 'ProfileAgent' }, 'Tool selected')
        return {
          type: 'tool',
          content: await ProfileAgent.handle({ userId: input.userId }),
        }
      }

      case 'support':
      default:
        return {
          type: 'llm',
          prompt: input.message,
        }
    }
  }
}
