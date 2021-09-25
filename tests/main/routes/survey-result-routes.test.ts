import app from '@/main/config/app'
import { mockAccessToken } from '@/tests/main/mocks'
import { MongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'
import request from 'supertest'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('Deve retornar 403 porque o accessToken não foi informado', async () => {
      await request(app)
        .put(`/api/surveys/${0}/results`)
        .send({
          answer: 'Answer'
        })
        .expect(403)
    })
    test('Deve retornar 200 porque a resposta foi salva com sucesso', async () => {
      const accessToken = await mockAccessToken(accountCollection)
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      })
      const id: string = res.insertedId.toHexString()
      await request(app)
        .put(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_answer'
        })
        .expect(200)
    })
  })
  describe('GET /surveys/:surveyId/results', () => {
    test('Deve retornar 403 porque o accessToken não foi informado', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })
    test('Deve retornar 200 e as respostas salvas com sucesso', async () => {
      const accessToken = await mockAccessToken(accountCollection)
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      })
      const id: string = res.insertedId.toHexString()
      await request(app)
        .get(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
