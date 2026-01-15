import type { Context } from 'hono'
import { stream } from 'hono/streaming'
import { ChatService } from '../services/chat.service'
import { prisma } from '@agent/db'

/**
 * Type guard: ai-sdk StreamTextResult
 */
function isStreamTextResult(
  stream: unknown
): stream is { textStream: AsyncIterable<string> } {
  return (
    typeof stream === 'object' &&
    stream !== null &&
    'textStream' in stream
  )
}

/**
 * Type guard: Web ReadableStream
 */
function isReadableStream(
  stream: unknown
): stream is ReadableStream<Uint8Array> {
  return (
    typeof stream === 'object' &&
    stream !== null &&
    typeof (stream as ReadableStream).getReader === 'function'
  )
}

export class ChatController {
  // -----------------------------
  // Normal (non-streaming) chat
  // -----------------------------
  static async sendMessage(c: Context) {
    const body = await c.req.json()
    const result = await ChatService.handleMessage(body)
    return c.json(result)
  }

  // -----------------------------
  // Conversation list
  // -----------------------------
  static async listConversations(c: Context) {
    const userId = c.req.query('userId')
    const conversations = await ChatService.listConversations(userId!)
    return c.json(conversations)
  }

  // -----------------------------
  // Get conversation history
  // -----------------------------
  static async getConversation(c: Context) {
    const id = c.req.param('id')
    const conversation = await ChatService.getConversation(id)
    return c.json(conversation)
  }

  // -----------------------------
  // Delete conversation
  // -----------------------------
  static async deleteConversation(c: Context) {
    const id = c.req.param('id')
    await ChatService.deleteConversation(id)
    return c.json({ success: true })
  }

  // -----------------------------
  // STREAMING CHAT (FIXED)
  // -----------------------------
  static async streamMessage(c: Context) {
    const body = await c.req.json()

    const { stream: resultStream, convoId } =
      await ChatService.streamMessage(body)

    return stream(c, async (writer) => {
      let fullResponse = ''

      // Optional UI hint
      await writer.write('[typing]\n')

      // -----------------------------
      // CASE 1: LLM STREAM (ai-sdk)
      // -----------------------------
      if (isStreamTextResult(resultStream)) {
        for await (const chunk of resultStream.textStream) {
          fullResponse += chunk
          await writer.write(chunk)
        }
      }

      // -----------------------------
      // CASE 2: TOOL STREAM (Prisma)
      // -----------------------------
      else if (isReadableStream(resultStream)) {
        const reader = resultStream.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          fullResponse += chunk
          await writer.write(chunk)
        }
      }

      // -----------------------------
      // Persist agent response ONCE
      // -----------------------------
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
