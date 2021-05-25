import { AccountModel } from '@/domain/models/account'

// Está type está diretamente relacionada a esse use case AddAccount por esse motivo foi colocada no mesmo arquivo.
export type AddAccountModel = {
  name: string
  email: string
  password: string
}

export type AddAccount = {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
