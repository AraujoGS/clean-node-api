import { setupApp } from '@/main/config/app'
import { MongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { Express } from 'express'
import request from 'supertest'
let app: Express = null
let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    // antes de cada teste limpo a base de dados
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Deve retornar 200 no signup', async () => {
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
    test('Deve retornar 403 no signup', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Guilherme',
        email: 'guilhermearaujo421@gmail.com',
        password
      })
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Guilherme',
          email: 'guilhermearaujo421@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(403)
    })
  })

  describe('POST /login', () => {
    test('Deve retornar 200 no login ', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Guilherme',
        email: 'guilhermearaujo421@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'guilhermearaujo421@gmail.com',
          password: '123'
        })
        .expect(200)
    })
    test('Deve retornar 401 no login ', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'guilhermearaujo421@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
