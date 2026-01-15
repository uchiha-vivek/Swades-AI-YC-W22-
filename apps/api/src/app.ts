import { Hono } from 'hono'
import { chatRoutes } from './routes/chat.routes.js'
import { agentRoutes } from './routes/agent.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js'

export const app = new Hono()

app.use('*', errorMiddleware)

app.route('/api/chat', chatRoutes)
app.route('/api/agents', agentRoutes)

app.get('/health', (c) => c.json({ status: 'ok' }))
