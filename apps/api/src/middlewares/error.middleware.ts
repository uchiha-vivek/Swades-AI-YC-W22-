export const errorMiddleware = async (c: any, next: any) => {
  try {
    await next()
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
}
