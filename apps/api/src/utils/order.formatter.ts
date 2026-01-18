import { generateText } from 'ai'
import { azure } from '../ai/ollama.js'
import { ORDER_RESPONSE_SYSTEM_PROMPT } from '../prompts/order.prompt.js'

type Order = {
  id: string
  status: string
  trackingId?: string | null
  createdAt: string
}

export async function formatOrdersResponse(orders: Order[]) {
  const { text } = await generateText({
    model: azure('gpt-4o-mini'),
    temperature: 0.35,
    system:ORDER_RESPONSE_SYSTEM_PROMPT,
    prompt: `
    Here is the user's order data (JSON):   
    ${JSON.stringify(orders, null, 2)}

    Write a response explaining the status of their orders.
`,
  })

  return text.trim()
}
