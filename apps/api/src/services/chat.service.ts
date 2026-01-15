import { prisma } from '@agent/db'
import { RouterAgent } from '../agents/router.agent'
import { streamText } from 'ai'
import { ollama } from '../ai/ollama'
import { getCompactedContext } from '../utils/contextManger'

export class ChatService {
  // -----------------------------
  // Non-streaming (simple reply)
  // -----------------------------
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

    // save user message
    await prisma.message.create({
      data: {
        conversationId: convoId,
        role: 'user',
        content: message,
      },
    })

    // 🔑 route via agents (Prisma-backed if needed)
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

    // ---------------------------------
    // CASE 1: TOOL-BACKED (Prisma hit)
    // ---------------------------------
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

    // ---------------------------------
    // CASE 2: SUPPORT / GENERAL → LLM
    // ---------------------------------
    const context = await getCompactedContext(convoId)

    const llmStream = await streamText({
      model: ollama('gemma3:latest'),
      messages: context,
    })

    return { convoId, stream: llmStream }
  }

  // -----------------------------
  // Conversation utilities
  // -----------------------------
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
