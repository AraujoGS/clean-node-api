import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

describe('Login Routes', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect('mongodb+srv://testHeroku123:testHeroku123@cluster0.jmdam.mongodb.net/clean-node-api?retryWrites=true&w=majority')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    // antes de cada teste limpo a base de dados
    accountCollection = await MongoHelper.getCollection('accounts')
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
