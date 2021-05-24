import app from '@/main/config/app'
import request from 'supertest'

describe('CORS Middleware', () => {
  test('Deve ter o CORS liberado nas requisições', async () => {
    app.get('/test_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
  })
})
