import { createXai } from '@ai-sdk/xai'

export const grok = createXai({
  apiKey: process.env.XAI_API_KEY!,
})
