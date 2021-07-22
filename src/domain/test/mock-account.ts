import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AuthenticationParams } from '@/domain/usecases/account/authentication'
import faker from 'faker'

export const mockAddAccountParams = (): AddAccountParams => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.datatype.string()
})

export const mockAccountModel = (): AccountModel => Object.assign({}, mockAddAccountParams(), { id: faker.datatype.uuid() })

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.datatype.string()
})
