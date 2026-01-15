import { rateLimiter } from 'hono-rate-limiter'
import type { Context } from 'hono'

export const chatRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // setting it to 1 minute 
  limit: 20,
  standardHeaders: true,
  keyGenerator: (c: Context) => {
    const body = c.req.method === 'POST' ? c.req.json?.() : null
    return c.req.header('x-user-id') ?? 'anonymous'
  },
})
