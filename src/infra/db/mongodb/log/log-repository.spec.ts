import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log-repository'

const makeSut = (): LogMongoRepository => (new LogMongoRepository())

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect('mongodb+srv://testHeroku123:testHeroku123@cluster0.jmdam.mongodb.net/clean-node-api?retryWrites=true&w=majority')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('Deve criar um log de erro em caso de sucesso', async () => {
    const sut = makeSut()
    await sut.logError('any_error_stack')
    // como nossa implementação de logError não retorna nada, para validar se a inserção ocoreu faço um count dos documentos na collection.
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
