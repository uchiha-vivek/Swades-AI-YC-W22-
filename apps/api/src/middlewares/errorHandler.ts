import type { Context, Next } from 'hono'
import { logger } from '../lib/logger'

export async function errorHandler(c: Context, next: Next) {
  try {
    await next()
  } catch (err) {
    logger.error({
      err,
      path: c.req.path,
      method: c.req.method,
    }, 'Unhandled error')

    return c.json(
      { error: 'Internal Server Error' },
      500
    )
  }
}
