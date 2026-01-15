import { prisma } from '@agent/db'
import { RouterAgent } from '../agents/router.agent'
import { streamText } from 'ai'
import { ollama } from '../ai/ollama'
import { getCompactedContext } from '../utils/contextManger'

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

    await prisma.message.create({
      data: {
        conversationId: convoId,
        role: 'user',
        content: message,
      },
    })

    const response = await RouterAgent.route({
      userId,
      conversationId: convoId,
      message,
    })

    await prisma.message.create({
      data: {
        conversationId: convoId,
        role: 'agent',
        content: response,
      },
    })

    return { conversationId: convoId, response }
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

   
    await prisma.message.create({
      data: {
        conversationId: convoId,
        role: 'user',
        content: message,
      },
    })

   
    const context = await getCompactedContext(convoId)

  
    const stream = await streamText({
      model: ollama('gemma3:latest'),
      messages: context,
    })

    return {
      convoId,
      stream,
    }
  }
}
