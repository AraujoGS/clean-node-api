import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /surveys', () => {
    test('Deve retornar 403 porque o accessToken não foi informado', async () => {
      await request(app)
        .put('/api/surveys/:surveyId/results')
        .send({
          answer: 'Answer'
        })
        .expect(403)
    })
  })
})
