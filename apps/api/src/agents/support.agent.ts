import { getConversationHistory } from '../tools/conversation.tools.js'
import { formatSupportResponse } from '../utils/support.formatter.js'

type Input = {
  conversationId?: string
}

export class SupportAgent {
  static async handle({ conversationId }: Input) {
    if (!conversationId) {
      return 'Hello! How can I help you today?'
    }

    const history = await getConversationHistory(conversationId)

    if (history.length === 0) {
      return 'Hello! How can I help you today?'
    }

    const normalizedMessages = history.map(m => ({
      role: m.role,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    }))


    // console.log('Normalized messageds',normalizedMessages)
    return formatSupportResponse(normalizedMessages)
  }
}
