import { AddAccount, Authentication } from '@/domain/usecases'
import faker from 'faker'
import { AccountModel } from '../models'

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.datatype.string()
})

export const mockAccountModel = (): AccountModel => Object.assign({ ...mockAddAccountParams(), id: faker.datatype.uuid() })

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.datatype.string()
})
