import { getOrdersByUser } from '../tools/order.tools.js'

type Input = {
  userId: string
}

export class OrderAgent {
  static async handle({ userId }: Input) {
    const orders = await getOrdersByUser(userId)

    if (orders.length === 0) {
      return 'You do not have any orders yet.'
    }

    return orders
      .map(
        (o:any) =>
          `Order ${o.id} is ${o.status}${
            o.trackingId ? ` (Tracking ID: ${o.trackingId})` : ''
          }`
      )
      .join('\n')
  }
}
