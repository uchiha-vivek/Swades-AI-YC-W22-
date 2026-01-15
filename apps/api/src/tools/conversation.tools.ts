import { prisma } from '@agent/db'

export const getConversationHistory = (conversationId: string) =>
  prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  })
