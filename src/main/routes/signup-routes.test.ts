import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    // A lib 'jest-mongodb' seta a URL do mongo em memória dentro do env
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    // antes de cada teste limpo a base de dados
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

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
