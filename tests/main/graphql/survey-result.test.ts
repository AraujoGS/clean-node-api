import { setupApp } from '@/main/config/app'
import { mockAccessToken } from '@/tests/main/mocks'
import { MongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'
import { Express } from 'express'
import request from 'supertest'

let app: Express = null
let surveyCollection: Collection
let accountCollection: Collection

const makeQuerySurveyResult = async (): Promise<string> => {
  const surveyRes = await surveyCollection.insertOne({
    question: 'Question',
    answers: [{
      answer: 'Answer 1',
      image: 'http://image-name.com'
    }, {
      answer: 'Answer 2'
    }],
    date: new Date()
  })
  const query = `query {
    surveyResult (surveyId: "${surveyRes.insertedId.toHexString()}") {
      question
      answers {
        answer
        count
        percent
        isCurrentAccountAnswer
      }
      date
    }
  }`
  return query
}

const makeMutationSurveyResult = async (): Promise<string> => {
  const surveyRes = await surveyCollection.insertOne({
    question: 'Question',
    answers: [{
      answer: 'Answer 1',
      image: 'http://image-name.com'
    }, {
      answer: 'Answer 2'
    }],
    date: new Date()
  })
  const query = `mutation {
    saveSurveyResult (surveyId: "${surveyRes.insertedId.toHexString()}", answer: "Answer 1") {
      answers {
        answer
        count
        image
        isCurrentAccountAnswer
        percent
      } 
      date
      question
      surveyId
    }
  }`
  return query
}

describe('SurveyResult GraphQL', () => {
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

  describe('SurveyResult Query', () => {
    test('deve retornar erro porque não há permissão de acesso', async () => {
      const query = await makeQuerySurveyResult()
      await request(app)
        .post('/graphql')
        .send({ query })
        .expect(403)
    })

    test('deve retornar o resultado da enquete', async () => {
      const accessToken = await mockAccessToken(accountCollection)
      const query = await makeQuerySurveyResult()
      await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
        .expect(200)
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    test('deve retornar erro porque não há permissão de acesso', async () => {
      const query = await makeMutationSurveyResult()
      await request(app)
        .post('/graphql')
        .send({ query })
        .expect(403)
    })

    test('deve retornar o resultado da enquete', async () => {
      const accessToken = await mockAccessToken(accountCollection)
      const query = await makeMutationSurveyResult()
      await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
        .expect(200)
    })
  })
})
