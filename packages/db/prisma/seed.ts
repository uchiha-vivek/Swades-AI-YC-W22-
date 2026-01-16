import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database')

  // 1. Create a user
  const user = await prisma.user.create({
    data: {
      email: 'demo.user@example.com',
      name: 'Demo User',
    },
  })

  // 2. Create a conversation with messages (context)
  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      messages: {
        createMany: {
          data: [
            {
              role: 'user',
              content: 'Hi, I need some help',
            },
            {
              role: 'agent',
              content: 'Sure! How can I assist you?',
            },
          ],
        },
      },
    },
  })

  // 3. Create orders
  await prisma.order.createMany({
    data: [
      {
        id: 'ORD-1001',
        userId: user.id,
        status: 'shipped',
        trackingId: 'TRACK-123',
      },
      {
        id: 'ORD-1002',
        userId: user.id,
        status: 'processing',
      },
    ],
  })

  // 4. Create invoices
  await prisma.invoice.createMany({
    data: [
      {
        id: 'INV-9001',
        userId: user.id,
        amount: 49.99,
        status: 'paid',
      },
      {
        id: 'INV-9002',
        userId: user.id,
        amount: 19.99,
        status: 'refunded',
      },
    ],
  })

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
