import { SurveyMongoRepository, MongoHelper } from '@/infra/db'
import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { AccountModel } from '@/domain/models'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'
import faker from 'faker'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const mockAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  })

  return MongoHelper.map(res.ops[0])
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    MockDate.set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  beforeEach(async () => {
    // antes de cada teste limpo a base de dados
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Deve adicionar uma enquete com sucesso', async () => {
      const sut = makeSut()
      const params = mockAddSurveyParams()
      await sut.add(params)
      const survey = await surveyCollection.findOne({ question: params.question })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Deve retornar uma lista com as enquetes em caso de sucesso', async () => {
      const account = await mockAccount()
      const addSurveyParams1 = mockAddSurveyParams()
      const addSurveyParams2 = mockAddSurveyParams()
      const result = await surveyCollection.insertMany([addSurveyParams1, addSurveyParams2])
      const survey = result.ops[0]
      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyParams1.question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[1].question).toBe(addSurveyParams2.question)
      expect(surveys[1].didAnswer).toBe(false)
    })
    test('Deve retornar uma lista vazia caso não tenha enquetes', async () => {
      const account = await mockAccount()
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Deve retornar a enquete em caso de sucesso', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const id = res.ops[0]._id
      const sut = makeSut()
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })
})