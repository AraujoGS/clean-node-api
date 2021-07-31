/**
 * Como o arquivo de imports dos protocolos para a implementação db-add-account é usada
 * especificamente para a classe concreta, não vai ser utilizada aqui.
 * Os imports serão direto do domain
 */
import { AddAccount } from '@/domain/usecases'

export interface AddAccountRepository {
  add: (account: AddAccount.Params) => Promise<AddAccount.Result>
}
