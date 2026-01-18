import { getOrdersByUser } from '../tools/order.tools.js'
import {formatOrdersResponse} from '../utils/order.formatter.js'

type Input = {
  userId: string
}

export class OrderAgent {
  static async handle({ userId }: Input) {
    const orders = await getOrdersByUser(userId)

    if (orders.length === 0) {
      return 'You do not have any orders yet.'
    }

   // making typescript fix for normalization   
   const normalizedOrders = orders.map(order => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
    }))

    return formatOrdersResponse(normalizedOrders)
  }
}
