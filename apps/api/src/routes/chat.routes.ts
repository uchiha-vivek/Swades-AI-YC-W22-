import { Hono } from 'hono'
import { ChatController } from '../controllers/chat.controller.js'
import { chatRateLimiter } from '../middlewares/rateLimit.js'
import { mockAuth } from '../middlewares/mockAuth.js'
export const chatRoutes = new Hono()

chatRoutes.use("*",mockAuth)
chatRoutes.use("*",chatRateLimiter)
chatRoutes.post('/messages', ChatController.sendMessage)
chatRoutes.post('/messages/stream', ChatController.streamMessage)
chatRoutes.get('/conversations', ChatController.listConversations)
chatRoutes.get('/conversations/:id', ChatController.getConversation)
chatRoutes.delete('/conversations/:id', ChatController.deleteConversation)
