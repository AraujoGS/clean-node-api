import { AddAccount, Authentication, LoadAccountByToken } from '@/domain/usecases'
import { mockAccountModel } from '@/tests/domain/mocks'
import faker from 'faker'

export class AuthenticationSpy implements Authentication {
  authenticationModel = {
    accessToken: faker.datatype.string(8),
    name: faker.name.findName()
  }

  autheticationData: Authentication.Params
  async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
    this.autheticationData = authentication
    return await Promise.resolve(this.authenticationModel)
  }
}

export class AddAccountSpy implements AddAccount {
  account = mockAccountModel()
  accountData: AddAccount.Params
  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    this.accountData = account
    return await Promise.resolve(this.account)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  account = mockAccountModel()
  accessToken: string
  role: string
  async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
    this.accessToken = accessToken
    this.role = role
    return await Promise.resolve(this.account)
  }
}
