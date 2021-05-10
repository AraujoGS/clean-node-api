import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

describe('Account Mongo Repository', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect('mongodb+srv://testHeroku123:testHeroku123@cluster0.jmdam.mongodb.net/clean-node-api?retryWrites=true&w=majority')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    // antes de cada teste limpo a base de dados
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Deve retornar uma conta com sucesso no add', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy() // Não estamos mockando o mongo então pra mim caso retorne um id, eu considero válido
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
  test('Deve retornar uma conta com sucesso no loadByEmail', async () => {
    const sut = makeSut()
    // inserindo um usuário antes do teste
    await accountCollection.insertOne(({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }))
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
  test('Deve retornar um null quando falhar o loadByEmail', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })
  test('Deve atualizar o accessToken de uma conta com sucesso no updateAccessToken', async () => {
    const sut = makeSut()
    const { ops: [result] } = await accountCollection.insertOne(({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }))
    expect(result.accessToken).toBeFalsy()
    await sut.updateAccessToken(result._id, 'any_token')
    const account = await accountCollection.findOne({ _id: result._id })
    expect(account).toBeTruthy()
    expect(account.accessToken).toBe('any_token')
  })
})
