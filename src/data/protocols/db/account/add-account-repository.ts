/**
 * Como o arquivo de imports dos protocolos para a implementação db-add-account é usada
 * especificamente para a classe concreta, não vai ser utilizada aqui.
 * Os imports serão direto do domain
 */
import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

export interface AddAccountRepository {
  add: (account: AddAccountParams) => Promise<AccountModel>
}
