import { generateText } from 'ai'
import { azure } from '../ai/ollama.js'
import { BILLING_RESPONSE_SYSTEM_PROMPT } from '../prompts/billing.prompt.js'
import type { Invoice } from '../types/invoice.js'

export async function formatInvoicesResponse(invoices: Invoice[]) {
  const { text } = await generateText({
    model: azure('gpt-4o-mini'),
    temperature: 0.35,
    system: BILLING_RESPONSE_SYSTEM_PROMPT,
    prompt: `
Here is the user's invoice data (JSON):
${JSON.stringify(invoices, null, 2)}

Explain the invoice status to the user.
`,
  })

  return text.trim()
}
