import { api } from './client'

describe('Health API', () => {
  it('should return ok', async () => {
    const res = await api.get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})
