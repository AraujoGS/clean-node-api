import { AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '@/data/protocols/db'
import { AccountModel } from '@/domain/models'
import { AddAccountParams } from '@/domain/usecases'
import { mockAccountModel } from '@/tests/domain/mocks'

export class AddAccountRepositorySpy implements AddAccountRepository {
  account = mockAccountModel()
  accountParams: AddAccountParams
  async add (account: AddAccountParams): Promise<AccountModel> {
    this.accountParams = account
    return await Promise.resolve(this.account)
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  account = mockAccountModel()
  email: string
  async loadByEmail (email: string): Promise<AccountModel> {
    this.email = email
    return await Promise.resolve(this.account)
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  account = mockAccountModel()
  token: string
  role: string
  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    this.token = token
    this.role = role
    return await Promise.resolve(this.account)
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
