import { beforeAll, afterAll } from 'vitest'
import { prisma } from '@agent/db'

beforeAll(async () => {
  // Clean DB before tests
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})
