import { getConversationHistory } from '../tools/conversation.tools.js'
import { formatSupportResponse } from '../utils/support.formatter.js'

type Input = {
  conversationId?: string
}
type LLMRole = 'user' | 'assistant'

export class SupportAgent {
  static async handle({ conversationId }: Input) {
    if (!conversationId) {
      return 'Hello! How can I help you today?'
    }

    const history = await getConversationHistory(conversationId)

    if (history.length === 0) {
      return 'Hello! How can I help you today?'
    }

    const normalizedMessages: {
      role: LLMRole
      content: string
      createdAt: string
    }[] = history.map(m => ({
      role: m.role === 'agent' ? 'assistant' : 'user',
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    }))




    // console.log('Normalized messageds',normalizedMessages)
    return formatSupportResponse(normalizedMessages)
  }
}
