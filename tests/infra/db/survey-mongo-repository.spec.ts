import { SurveyMongoRepository, MongoHelper } from '@/infra/db'
import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { Collection, ObjectId } from 'mongodb'
import MockDate from 'mockdate'
import faker from 'faker'
import FakeObjectId from 'bson-objectid'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  })

  return res.insertedId.toHexString()
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
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
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
      const accountId = await mockAccountId()
      const addSurveyParams1 = mockAddSurveyParams()
      const addSurveyParams2 = mockAddSurveyParams()
      const result = await surveyCollection.insertMany([addSurveyParams1, addSurveyParams2])
      const survey = await surveyCollection.findOne({ _id: result.insertedIds[0] })
      await surveyResultCollection.insertOne({
        accountId: new ObjectId(accountId),
        surveyId: survey._id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyParams1.question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[1].question).toBe(addSurveyParams2.question)
      expect(surveys[1].didAnswer).toBe(false)
    })
    test('Deve retornar uma lista vazia caso n??o tenha enquetes', async () => {
      const accountId = await mockAccountId()
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Deve retornar a enquete em caso de sucesso', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const id = res.insertedId.toHexString()
      const sut = makeSut()
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
    test('Deve retornar null caso a enquete n??o exista', async () => {
      const sut = makeSut()
      const survey = await sut.loadById(new FakeObjectId().toHexString())
      expect(survey).toBeNull()
    })
  })

  describe('checkById()', () => {
    test('Deve retornar true em caso de sucesso', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const id = res.insertedId.toHexString()
      const sut = makeSut()
      const exists = await sut.checkById(id)
      expect(exists).toBe(true)
    })
    test('Deve retornar false caso o survey n??o exista', async () => {
      const sut = makeSut()
      const exists = await sut.checkById(new FakeObjectId().toHexString())
      expect(exists).toBe(false)
    })
  })

  describe('loadAnswers()', () => {
    test('Deve retornar os answers em caso de sucesso', async () => {
      const survey = mockAddSurveyParams()
      const res = await surveyCollection.insertOne(survey)
      const id = res.insertedId.toHexString()
      const sut = makeSut()
      const answers = await sut.loadAnswers(id)
      expect(answers).toEqual([survey.answers[0].answer])
    })
    test('Deve retornar um array vazio caso o survey n??o exista', async () => {
      const sut = makeSut()
      const answers = await sut.loadAnswers(new FakeObjectId().toHexString())
      expect(answers).toEqual([])
    })
  })
})
