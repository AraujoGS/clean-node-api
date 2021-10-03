import { setupApp } from '@/main/config/app'
import { MongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { Express } from 'express'
import request from 'supertest'
let app: Express = null
let accountCollection: Collection

describe('Login GraphQL', () => {
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

  describe('Login Query', () => {
    const query = `query {
      login(email: "guilhermearaujo421@gmail.com", password: "123") {
        name, accessToken
      }
    }`

    test('Deve retornar uma conta quando as credenciais são válidas', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Guilherme',
        email: 'guilhermearaujo421@gmail.com',
        password
      })

      await request(app)
        .post('/graphql')
        .send({ query })
        .expect(200)
    })

    test('Deve retornar erro 401 quando as credenciais não são válidas', async () => {
      await request(app)
        .post('/graphql')
        .send({ query })
        .expect(401)
    })
  })

  describe('SignUp Mutation', () => {
    const query = `mutation {
      signUp(
        name: "Gabriel Silva",
        email: "silvagaraujo@gmail.com", 
        password: "123",
        passwordConfirmation: "123"
      ) {
        name, accessToken
      }
    }`

    test('Deve retornar uma nova conta caso o input esteja correto', async () => {
      await request(app)
        .post('/graphql')
        .send({ query })
        .expect(200)
    })

    test('Deve retornar erro porque o email informado já está sendo utilizado', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Gabriel Silva',
        email: 'silvagaraujo@gmail.com',
        password
      })

      await request(app)
        .post('/graphql')
        .send({ query })
        .expect(403)
    })
  })
})
