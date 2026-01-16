import { OrderAgent } from './order.agent'
import { BillingAgent } from './billing.agent'
import { SupportAgent } from './support.agent'
import { logger } from '../lib/logger'

type AgentInput = {
  userId: string
  conversationId?: string
  message: string
}

type AgentResult =
  | { type: 'tool'; content: string }
  | { type: 'llm'; prompt: string }

function detectIntent(message: string) {
  const text = message.toLowerCase()

  if (
    text.includes('order') ||
    text.includes('delivery') ||
    text.includes('tracking')
  ) {
    return 'order'
  }

  if (
    text.includes('invoice') ||
    text.includes('payment') ||
    text.includes('bill')
  ) {
    return 'billing'
  }

  return 'support'
}

export class RouterAgent {
  static async handle(input: AgentInput): Promise<AgentResult> {
    const intent = detectIntent(input.message)
    logger.info({
        intent,
        userId:input.userId,
        conversationId:input.conversationId?? null
    })
    switch (intent) {
      case 'order': {
        logger.info({ agent: 'OrderAgent' }, 'Tool selected')
        const result = await OrderAgent.handle(input)
        return { type: 'tool', content: result }
      }

      case 'billing': {
        logger.info({ agent: 'BillingAgent' }, 'Tool selected')
        const result = await BillingAgent.handle(input)
        return { type: 'tool', content: result }
      }

      case 'support': {
        logger.info({ agent: 'SupportAgent' }, 'Tool selected')
        return { type: 'llm', prompt: input.message }
      }

      default:
        return {
          type: 'llm',
          prompt: input.message,
        }
    }
  }
}
