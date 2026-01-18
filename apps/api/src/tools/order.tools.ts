import { prisma } from '@agent/db'


export const getOrdersByUser = (userId: string) =>
  prisma.order.findMany({ where: { userId } })
