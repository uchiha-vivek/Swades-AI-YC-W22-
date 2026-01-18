import { prisma } from '@agent/db'
import { RouterAgent } from '../agents/router.agent.js'
import { streamText } from 'ai'
import { azure} from '../ai/ollama.js'
import { getCompactedContext } from '../utils/contextManger.js'
import { openai } from '@ai-sdk/openai'

export class ChatService {
   
  static async handleMessage({
    userId,
    conversationId,
    message,
  }: {
    userId: string
    conversationId?: string
    message: string
  }) {
    const convoId =
      conversationId ??
      (
        await prisma.conversation.create({
          data: { userId },
        })
      ).id

    // save the user message 
    await prisma.message.create({
      data: {
        conversationId: convoId,
        role: 'user',
        content: message,
      },
    })

    // Here we are routing via agent
    const result = await RouterAgent.handle({
      userId,
      conversationId: convoId,
      message,
    })

    // normalize response text
    const response =
      result.type === 'tool' ? result.content : result.prompt

    // save agent message
    await prisma.message.create({
      data: {
        conversationId: convoId,
        role: 'agent',
        content: response,
      },
    })

    return { conversationId: convoId, response }
  }

  // -----------------------------
  // Streaming (correct + safe)
  // -----------------------------
  static async streamMessage({
    userId,
    conversationId,
    message,
  }: {
    userId: string
    conversationId?: string
    message: string
  }) {
    const convoId =
      conversationId ??
      (
        await prisma.conversation.create({
          data: { userId },
        })
      ).id

    // save user message
    await prisma.message.create({
      data: {
        conversationId: convoId,
        role: 'user',
        content: message,
      },
    })

    // 🔑 ROUTE FIRST (this decides tools vs LLM)
    const result = await RouterAgent.handle({
      userId,
      conversationId: convoId,
      message,
    })

    
    if (result.type === 'tool') {
      const encoder = new TextEncoder()
      const fullText = result.content

      const stream = new ReadableStream({
        start(controller) {
          const chunks = fullText.match(/.{1,25}/g) ?? []
          for (const chunk of chunks) {
            controller.enqueue(encoder.encode(chunk))
          }
          controller.close()
        },
      })

      // persist agent message
      await prisma.message.create({
        data: {
          conversationId: convoId,
          role: 'agent',
          content: fullText,
        },
      })

      return { convoId, stream }
    }

    
    const context = await getCompactedContext(convoId)
    console.log('Context',context)

    const llmStream = await streamText({
      model: azure('gpt-4o-mini'),
      messages: context,
    })

    return { convoId, stream: llmStream }
  }

   
  static async listConversations(userId: string) {
    return prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async getConversation(conversationId: string) {
    return prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  }

  static async deleteConversation(conversationId: string) {
    await prisma.conversation.delete({
      where: { id: conversationId },
    })
  }
}
