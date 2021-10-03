import { setupApp } from '@/main/config/app'
import { mockAccessToken, mockSurveysCollection } from '@/tests/main/mocks'
import { MongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'
import { Express } from 'express'
import request from 'supertest'

let app: Express = null
let surveyCollection: Collection
let accountCollection: Collection

describe('Survey GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Survey Query', () => {
    const query = `query {
      surveys {
        id
        question
        answers {
          answer
          image
        }
      }
    }`

    test('deve retornar erro porque não há permissão de acesso', async () => {
      await request(app)
        .post('/graphql')
        .send({ query })
        .expect(403)
    })

    test('deve retornar as enquetes em caso de sucesso', async () => {
      const accessToken = await mockAccessToken(accountCollection)
      await mockSurveysCollection(surveyCollection)
      await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
        .expect(200)
    })
  })
})
