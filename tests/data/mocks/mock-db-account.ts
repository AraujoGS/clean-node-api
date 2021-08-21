import { AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '@/data/protocols/db'
import { AddAccount } from '@/domain/usecases'
import { mockAccountModel } from '@/tests/domain/mocks'
import faker from 'faker'

export class AddAccountRepositorySpy implements AddAccountRepository {
  account = mockAccountModel()
  accountParams: AddAccount.Params
  async add (account: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.accountParams = account
    return await Promise.resolve(this.account)
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  account = mockAccountModel()
  email: string
  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    this.email = email
    return await Promise.resolve(this.account)
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  result = { id: faker.datatype.uuid() }
  token: string
  role: string
  async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
    this.token = token
    this.role = role
    return await Promise.resolve(this.result)
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string
  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
    return await Promise.resolve()
  }
}
