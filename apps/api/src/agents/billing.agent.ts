import { getInvoicesByUser } from '../tools/billing.tools'
import type { Invoice } from '../types/invoice'

export class BillingAgent {
  static async handle({ userId }: { userId: string }) {
    const invoices: Invoice[] = await getInvoicesByUser(userId)

    if (invoices.length === 0) {
      return 'You currently have no invoices.'
    }

    return invoices
      .map(
        (invoice: Invoice) =>
          `Invoice ${invoice.id}: Amount $${invoice.amount} — Status: ${invoice.status}`
      )
      .join('\n')
  }
}
