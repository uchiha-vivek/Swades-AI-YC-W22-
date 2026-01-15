import { beforeAll, afterAll } from 'vitest'
import { prisma } from '@agent/db'

const TEST_USER_ID = '55968d8b-a43a-48e6-bb0e-bd61ff16eb59'

beforeAll(async () => {
   
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()

   
  await prisma.user.upsert({
    where: { id: TEST_USER_ID },
    update: {},
    create: {
      id: TEST_USER_ID,
      email: 'demo.user@example.com',
    },
  })
})

afterAll(async () => {
  await prisma.$disconnect()
})
