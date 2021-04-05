import { AccountModel } from '../models/account'

// Essa interface está diretamente relacionada a esse use case AddAccount por esse motivo foi colocada no mesmo arquivo.
export interface AddAccountModel {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
