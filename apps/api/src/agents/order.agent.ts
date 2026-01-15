import { getOrdersByUser } from '../tools/order.tools'
import type { Order } from '../types/order'

export class OrderAgent {
  static async handle({ userId }: { userId: string }) {
    const orders: Order[] = await getOrdersByUser(userId)

    if (orders.length === 0) {
      return 'You do not have any orders yet.'
    }

    return orders
      .map(
        (order: Order) =>
          `Order ${order.id} is currently "${order.status}"${
            order.trackingId ? ` (Tracking ID: ${order.trackingId})` : ''
          }`
      )
      .join('\n')
  }
}
