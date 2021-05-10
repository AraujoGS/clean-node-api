import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect('mongodb+srv://testHeroku123:testHeroku123@cluster0.jmdam.mongodb.net/clean-node-api?retryWrites=true&w=majority')
  })
  afterAll(async () => {
    await sut.disconnect()
  })
  test('Deve reconectar no banco de dados caso a conexão caia', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
