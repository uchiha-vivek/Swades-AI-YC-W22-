import { api } from './client'

describe('Agent APIs', () => {
  it('should list agents', async () => {
    const res = await api.get('/api/agents')

    expect(res.status).toBe(200)
    expect(res.body).toContain('support')
    expect(res.body).toContain('order')
    expect(res.body).toContain('billing')
  })

  it('should return order agent capabilities', async () => {
    const res = await api.get(
      '/api/agents/order/capabilities'
    )

    expect(res.status).toBe(200)
    expect(res.body.can).toContain('status')
  })
})
