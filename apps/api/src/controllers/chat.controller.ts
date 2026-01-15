import type { Context } from 'hono'
import { stream } from 'hono/streaming'
import { ChatService } from '../services/chat.service'
import { prisma } from '@agent/db'

export class ChatController {
   
  static async sendMessage(c: Context) {
    const body = await c.req.json()
    const result = await ChatService.handleMessage(body)
    return c.json(result)
  }

   
  static async listConversations(c: Context) {
    const userId = c.req.query('userId')
    const conversations = await ChatService.listConversations(userId!)
    return c.json(conversations)
  }

 
  static async getConversation(c: Context) {
    const id = c.req.param('id')
    const conversation = await ChatService.getConversation(id)
    return c.json(conversation)
  }

  
  static async deleteConversation(c: Context) {
    const id = c.req.param('id')
    await ChatService.deleteConversation(id)
    return c.json({ success: true })
  }

  // message streaming starts from here
  static async streamMessage(c: Context) {
    const body = await c.req.json()

    const { stream: aiStream, convoId } =
      await ChatService.streamMessage(body)

    return stream(c, async (s) => {
      let fullResponse = ''

       await s.write('[typing]\n')

      for await (const chunk of aiStream.textStream) {
        fullResponse += chunk
        await s.write(chunk)
      }

       
      await prisma.message.create({
        data: {
          conversationId: convoId,
          role: 'agent',
          content: fullResponse,
        },
      })
    })
  }
}
