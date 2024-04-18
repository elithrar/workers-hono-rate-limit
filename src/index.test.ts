import { Hono } from 'hono'
import { RateLimitBinding } from '.'

type keyConfig = {
  key: string;
}

class GoodRateLimiter implements RateLimitBinding {
  async limit(_: keyConfig) {
    return { success: true }
  }
}

class BadRateLimiter implements RateLimitBinding {
  async limit(_: keyConfig) {
    return { success: false }
  }
}


describe('rateLimiting works as expected', () => {
  const app = new Hono()

  app.use('/hello/*', hello())
  app.get('/hello/foo', (c) => c.text('foo'))

  app.use('/x/*', hello('X'))
  app.get('/x/foo', (c) => c.text('foo'))

  it('should rate limit', async () => {
    const res = await app.request('http://localhost/hello/foo')
    expect(res).not.toBeNull()
    expect(res.status).toBe(200)
    expect(res.headers.get('X-Message')).toBe('Hello!')
  })

  it('should not rate limit', async () => {
    const res = await app.request('http://localhost/x/foo')
    expect(res).not.toBeNull()
    expect(res.status).toBe(200)
    expect(res.headers.get('X-Message')).toBe('X')
  })
})
