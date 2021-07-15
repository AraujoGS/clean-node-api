import { AccountModel } from '@/domain/models/account'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { AuthenticationModel } from '@/domain/models/authentication'
import { mockAccountModel } from '@/domain/test'
import faker from 'faker'

export class AuthenticationSpy implements Authentication {
  authenticationModel = {
    accessToken: faker.datatype.string(8),
    name: faker.name.findName()
  }

  autheticationData: AuthenticationParams
  async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
    this.autheticationData = authentication
    return await Promise.resolve(this.authenticationModel)
  }
}

export class AddAccountSpy implements AddAccount {
  account = mockAccountModel()
  accountData: AddAccountParams
  async add (account: AddAccountParams): Promise<AccountModel> {
    this.accountData = account
    return await Promise.resolve(this.account)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  account = mockAccountModel()
  accessToken: string
  role: string
  async load (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role
    return await Promise.resolve(this.account)
  }
}
