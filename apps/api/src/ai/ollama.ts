import { createOpenAI } from '@ai-sdk/openai'
import {createAzure} from '@ai-sdk/azure'
// export const ollama = createOpenAI({
// //   baseURL: 'http://localhost:11434/v1',
//   apiKey: process.env.OPENAI_API_KEY!, 
// })
export const azure = createAzure({
    resourceName:'leomartile-prod',
    apiKey:process.env.AZURE_OPENAI_API_KEY
})
