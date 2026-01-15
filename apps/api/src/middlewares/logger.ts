import type { Context, Next } from 'hono'
import { logger } from '../lib/logger.js'

export async function requestLogger(c: Context, next: Next) {
  const start = Date.now()

  try {
    await next()
  } finally {
    const duration = Date.now() - start

    logger.info({
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      durationMs: duration,
      userId: c.req.header('x-user-id') ?? null,
    }, 'HTTP request')
  }
}
