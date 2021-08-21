import { AddAccount } from '@/domain/usecases'
import { Hasher } from '@/data/protocols/cryptography'
import { AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols/db'
/**
 * Implementação do protocolo AddAccount definido no domain, ou seja,
 * implementação da minha regra de negocio. Nesse caso utilizando uma abordagem
 * com banco de dados.
 */
export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (params: AddAccount.Params): Promise<AddAccount.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(params.email)
    let isValid: boolean = false
    if (!account) {
      const hashedPassword = await this.hasher.hash(params.password)
      isValid = await this.addAccountRepository.add(Object.assign({}, params, { password: hashedPassword }))
    }
    return isValid
  }
}
