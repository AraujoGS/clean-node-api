import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('Deve retornar uma conta criada quando sucesso', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Guilherme',
        email: 'guilhermearaujo421@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
