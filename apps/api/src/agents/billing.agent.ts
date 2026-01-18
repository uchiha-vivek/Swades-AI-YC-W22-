import { getInvoicesByUser } from '../tools/billing.tools.js'
import type { Invoice } from '../types/invoice.js'
import {formatInvoicesResponse} from '../utils/billing.formatter.js'

export class BillingAgent {
  static async handle({ userId }: { userId: string }) {
    const invoices: Invoice[] = await getInvoicesByUser(userId)

    if (invoices.length === 0) {
      return 'You currently have no invoices.'
    }

    return formatInvoicesResponse(invoices)
  }
}
