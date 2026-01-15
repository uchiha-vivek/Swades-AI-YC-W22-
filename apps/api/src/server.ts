import { serve } from '@hono/node-server'
import { app } from "./app"

serve({
  fetch: app.fetch,
  port: 3001,
})

console.log('API running on http://localhost:3001')
