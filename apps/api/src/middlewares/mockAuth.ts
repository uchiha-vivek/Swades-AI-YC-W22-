// Right now i am setting it to autheticate the user by considering its authenticated
// In real systems it needs to be handled after authentication and once access token is verified

import type { Context, Next } from 'hono'

export async function mockAuth(c: Context, next: Next) {
  
  c.set('user', {
    id: '55968d8b-a43a-48e6-bb0e-bd61ff16eb59',
    email: 'demo.user@example.com',
    name: 'Demo User',
  })// same as stored in prisma

   
  c.req.header('x-user-id') ?? c.req.raw.headers.set(
    'x-user-id',
    '55968d8b-a43a-48e6-bb0e-bd61ff16eb59'
  )

  await next()
}