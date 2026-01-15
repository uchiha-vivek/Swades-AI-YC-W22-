import { prisma } from '@agent/db'

export const getInvoicesByUser = (userId: string) =>
  prisma.invoice.findMany({ where: { userId } })
