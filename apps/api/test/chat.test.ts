import { api } from './client'
import { vi } from 'vitest'

const USER_ID = '55968d8b-a43a-48e6-bb0e-bd61ff16eb59'
let conversationId: string

vi.mock('../src/agents/router.agent.js', () => ({
  RouterAgent: {
    handle: vi.fn().mockResolvedValue({
      type: 'agent',
      prompt: 'Test response',
    }),
  },
}))

describe('Chat APIs', () => {
  it('should send a message', async () => {
    const res = await api
      .post('/api/chat/messages')
      .set('x-user-id', USER_ID)
      .send({
        userId: USER_ID,
        message: 'Where is my order?',
      })

    expect(res.status).toBe(200)
    expect(res.body.response).toBeDefined()
    expect(res.body.conversationId).toBeDefined()

    conversationId = res.body.conversationId
  })

  it('should list conversations', async () => {
    const res = await api.get(
      `/api/chat/conversations?userId=${USER_ID}`
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

  
})
