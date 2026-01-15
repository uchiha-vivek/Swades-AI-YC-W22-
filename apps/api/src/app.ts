import { Hono } from 'hono'
import { chatRoutes } from './routes/chat.routes.js'
import { agentRoutes } from './routes/agent.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import { requestLogger } from './middlewares/logger.js'
import { errorHandler } from './middlewares/errorHandler.js'
import {cors} from 'hono/cors'
export const app = new Hono()
app.use('*', cors({
  origin: 'http://localhost:5173',  
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))
// app.use("*",requestLogger)
// app.use("*",errorHandler)
// app.use('*', errorMiddleware)
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json(
    {
      error: 'Internal Server Error',
    },
    500
  )
})

app.route('/api/chat', chatRoutes)
app.route('/api/agents', agentRoutes)

app.get('/health', (c) => c.json({ status: 'ok' }))
