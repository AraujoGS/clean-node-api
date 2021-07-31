import { AccountModel } from '@/domain/models'

export namespace AddAccount {
  export type Params = Omit<AccountModel, 'id'>
  export type Result = AccountModel
}

export interface AddAccount {
  add: (params: AddAccount.Params) => Promise<AddAccount.Result>
}
