// use of this code 
// It prevents token overflow, slow responses,  prevents memory burstout

import { prisma } from '@agent/db'
import { generateText } from 'ai'
import { azure } from '../ai/ollama.js'
import { openai } from '@ai-sdk/openai'

const MAX_MESSAGES = 10

export async function getCompactedContext(conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!conversation) return []

  const messages = conversation.messages
  console.log('Mesages',messages)

   
  if (messages.length <= MAX_MESSAGES) {
    return messages.map((m:any) => ({
      role: m.role,
      content: m.content,
    }))
  }

 
  const oldMessages = messages.slice(0, messages.length - MAX_MESSAGES)
  const recentMessages = messages.slice(-MAX_MESSAGES)

  
  const oldText = oldMessages
    .map((m:any) => `${m.role}: ${m.content}`)
    .join('\n')

  const { text } = await generateText({
    model: azure('gpt-4o-mini'),
    prompt: `Summarize the following conversation briefly so it can be used as context later:\n\n${oldText}`,
  })

  const summary = text.trim()

  // Persist summary
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { summary },
  })

  return [
    {
      role: 'system',
      content: `Conversation summary: ${summary}`,
    },
    ...recentMessages.map((m:any) => ({
      role: m.role,
      content: m.content,
    })),
  ]
}
