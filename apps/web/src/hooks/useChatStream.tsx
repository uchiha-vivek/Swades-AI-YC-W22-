import { useState } from 'react'
import type { Message } from '../types/chat'
import { DEMO_USER_ID } from '../constants/user'

export function useChatStream() {
  const [messages, setMessages] = useState<Message[]>([])
  const [thinking, setThinking] = useState(true)

  async function sendMessage(
    text: string,
    conversationId?: string
  ) {
 
    const userId = DEMO_USER_ID

    setMessages((m) => [...m, { role: 'user', content: text }])
    setThinking(true)

    const res = await fetch(
      'http://localhost:3001/api/chat/messages/stream',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, conversationId, message: text }),
      }
    )

    if (!res.body) {
      setThinking(false)
      throw new Error('No response body')
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let agentText = ''

    
    setMessages((m) => [...m, { role: 'agent', content: '' }])

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      agentText += decoder.decode(value, { stream: true })

      setMessages((m) =>
        m.map((msg, i) =>
          i === m.length - 1
            ? { ...msg, content: agentText }
            : msg
        )
      )
    }

    setThinking(false)
  }

  return { messages, sendMessage, thinking }
}
