import { AccountMongoRepository, MongoHelper } from '@/infra/db'
import { mockAddAccountParams } from '@/tests/domain/mocks'
import { Collection } from 'mongodb'
import faker from 'faker'

describe('Account Mongo Repository', () => {
  let accountCollection: Collection
  let accessToken: string
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    // antes de cada teste limpo a base de dados
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    accessToken = faker.datatype.uuid()
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('Deve retornar uma conta com sucesso no add', async () => {
      const sut = makeSut()
      const params = mockAddAccountParams()
      const account = await sut.add(params)

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy() // Não estamos mockando o mongo então pra mim caso retorne um id, eu considero válido
      expect(account.name).toBe(params.name)
      expect(account.email).toBe(params.email)
      expect(account.password).toBe(params.password)
    })
  })

  describe('loadByEmail()', () => {
    test('Deve retornar uma conta com sucesso no loadByEmail', async () => {
      const sut = makeSut()
      // inserindo um usuário antes do teste
      const params = mockAddAccountParams()
      await accountCollection.insertOne(params)
      const account = await sut.loadByEmail(params.email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(params.name)
      expect(account.email).toBe(params.email)
      expect(account.password).toBe(params.password)
    })
    test('Deve retornar um null quando falhar o loadByEmail', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(faker.internet.email())
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Deve atualizar o accessToken de uma conta com sucesso no updateAccessToken', async () => {
      const sut = makeSut()
      const { ops: [result] } = await accountCollection.insertOne(mockAddAccountParams())
      expect(result.accessToken).toBeFalsy()
      await sut.updateAccessToken(result._id, 'any_token')
      const account = await accountCollection.findOne({ _id: result._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    test('Deve retornar uma conta com sucesso no loadByToken sem usar a role', async () => {
      const sut = makeSut()
      const addAccountWithAccessToken = Object.assign({}, mockAddAccountParams(), { accessToken })
      await accountCollection.insertOne(addAccountWithAccessToken)
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountWithAccessToken.name)
      expect(account.email).toBe(addAccountWithAccessToken.email)
      expect(account.password).toBe(addAccountWithAccessToken.password)
    })
    test('Deve retornar uma conta com sucesso no loadByToken com uma role de admin', async () => {
      const sut = makeSut()
      const addAccountWithAccessTokenAndRole = Object.assign({}, mockAddAccountParams(), { accessToken, role: 'admin' })
      await accountCollection.insertOne(addAccountWithAccessTokenAndRole)
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountWithAccessTokenAndRole.name)
      expect(account.email).toBe(addAccountWithAccessTokenAndRole.email)
      expect(account.password).toBe(addAccountWithAccessTokenAndRole.password)
    })
    test('Deve retornar null no loadByToken quando exige role de admin, mas o usuário não possui', async () => {
      const sut = makeSut()
      const addAccountWithAccessToken = Object.assign({}, mockAddAccountParams(), { accessToken })
      await accountCollection.insertOne(addAccountWithAccessToken)
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeFalsy()
    })
    test('Deve retornar uma conta com sucesso no loadByToken com uma role de admin, quando não preciso de permissão admin', async () => {
      const sut = makeSut()
      const addAccountWithAccessTokenAndRole = Object.assign({}, mockAddAccountParams(), { accessToken, role: 'admin' })
      await accountCollection.insertOne(addAccountWithAccessTokenAndRole)
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountWithAccessTokenAndRole.name)
      expect(account.email).toBe(addAccountWithAccessTokenAndRole.email)
      expect(account.password).toBe(addAccountWithAccessTokenAndRole.password)
    })
    test('Deve retornar um null quando falhar o loadByToken', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeFalsy()
    })
  })
})
