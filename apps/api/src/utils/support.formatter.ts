import { generateText } from 'ai'
import { azure } from '../ai/ollama'
import { SUPPORT_RESPONSE_SYSTEM_PROMPT } from '../prompts/support.prompt.js'

type Message = {
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export async function formatSupportResponse(messages: Message[]) {
  const { text } = await generateText({
    model: azure('gpt-4o-mini'),
    temperature: 0.4,
    system: SUPPORT_RESPONSE_SYSTEM_PROMPT,
    prompt: `
Conversation history:
${JSON.stringify(messages, null, 2)}

Write the next assistant response.
`,
  })

  return text.trim()
}
