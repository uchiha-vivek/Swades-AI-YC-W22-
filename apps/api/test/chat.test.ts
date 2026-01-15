import { api } from './client'

let conversationId: string

describe('Chat APIs', () => {
  it('should send a message', async () => {
    const res = await api
      .post('/api/chat/messages')
      .set('x-user-id', 'test-user')
      .send({
        userId: 'test-user',
        message: 'Where is my order?',
      })

    expect(res.status).toBe(200)
    expect(res.body.response).toBeDefined()
    expect(res.body.conversationId).toBeDefined()

    conversationId = res.body.conversationId
  })

  it('should list conversations', async () => {
    const res = await api.get(
      '/api/chat/conversations?userId=test-user'
    )

    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('should get conversation messages', async () => {
    const res = await api.get(
      `/api/chat/conversations/${conversationId}`
    )

    expect(res.status).toBe(200)
    expect(res.body.messages.length).toBeGreaterThan(0)
  })

  it('should delete conversation', async () => {
    const res = await api.delete(
      `/api/chat/conversations/${conversationId}`
    )

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
})
