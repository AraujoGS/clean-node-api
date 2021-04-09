import { AddAccount, AddAccountModel, AccountModel, Encrypter } from './db-add-account-protocols'

/**
 * Implementação do protocolo AddAccount definido no domain, ou seja,
 * implementação da minha regra de negocio. Nesse caso utilizando uma abordagem
 * com banco de dados.
 */
export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => resolve(null))
  }
}
