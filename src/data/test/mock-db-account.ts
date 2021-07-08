import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

export class AddAccountRepositorySpy implements AddAccountRepository {
  private readonly account = mockAccountModel()
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
  private readonly account = mockAccountModel()
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
