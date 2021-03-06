import { setupApp } from '@/main/config/app'
import { mockAccessToken, mockSurveysCollection } from '@/tests/main/mocks'
import { MongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'
import { Express } from 'express'
import request from 'supertest'

let app: Express = null
let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    test('Deve retornar 403 porque o accessToken não foi informado', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question 1',
          answers: [{
            image: 'image 1',
            answer: 'Answer 1'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })
    test('Deve retornar 201 em caso de sucesso', async () => {
      const accessToken = await mockAccessToken(accountCollection)
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question 1',
          answers: [{
            image: 'image 1',
            answer: 'Answer 1'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(201)
    })
  })

  describe('GET /surveys', () => {
    test('Deve retornar 403 porque o accessToken não foi informado', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })
    test('Deve retornar 200 em caso de sucesso', async () => {
      const accessToken = await mockAccessToken(accountCollection)
      await mockSurveysCollection(surveyCollection)
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
