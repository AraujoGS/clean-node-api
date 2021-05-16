import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

describe('Survey Routes', () => {
  let surveyCollection: Collection
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect('mongodb+srv://testHeroku123:testHeroku123@cluster0.jmdam.mongodb.net/clean-node-api?retryWrites=true&w=majority')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
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
      const res = await accountCollection.insertOne({
        name: 'Guilherme',
        email: 'guilhermearaujo421@gmail.com',
        password: '123',
        role: 'admin'
      })
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({
        _id: id
      }, {
        $set: {
          accessToken
        }
      })
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
})
