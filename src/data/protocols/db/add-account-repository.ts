/**
 * Como o arquivo de imports dos protocolos para a implementação db-add-account é usada
 * especificamente para a classe concreta, não vai ser utilizada aqui.
 * Os imports serão direto do domain
 */
import { AccountModel } from '@/domain/models'
import { AddAccount } from '@/domain/usecases'

export namespace AddAccountRepository {
  export type Params = AddAccount.Params
  export type Result = AccountModel
}

export interface AddAccountRepository {
  add: (account: AddAccountRepository.Params) => Promise<AddAccountRepository.Result>
}
