import { prisma } from '@agent/db'

export class ProfileAgent {
  static async handle({ userId }: { userId: string }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
      },
    })

    if (!user) {
      return 'User not found.'
    }

    return `Your name is ${user.name ?? 'not set'} and your email is ${user.email ?? 'not set'}.`
  }
}
