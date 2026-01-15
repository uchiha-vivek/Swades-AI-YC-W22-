import { getConversationHistory } from '../tools/conversation.tools'

export class SupportAgent {
  static async handle({ conversationId }: any) {
    const history = await getConversationHistory(conversationId)

    if (history.length === 0) {
      return 'Hello! How can I help you today?'
    }

    return `I see we’ve already discussed ${history.length} messages. How can I assist further?`
  }
}
