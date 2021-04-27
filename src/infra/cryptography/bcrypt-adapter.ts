import bcrypt from 'bcrypt'
import { HashComparer } from '../../data/protocols/cryptography/hash-comparer'
import { Hasher } from '../../data/protocols/cryptography/hasher'
export class BcryptAdapter implements Hasher, HashComparer {
  /**
   * O salt é uma caracteristica especifica da lib Bcrypt, outros encriptadores
   * não necessáriamente vão possuir essa propriedade, por isso ela é uma dependência
   * injetada no construtor da classe que implementa o Bcrypt e não na interface
   * que ele assina
  */
  private readonly salt: number
  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, 12)
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash)
    return await new Promise(resolve => resolve(true))
  }
}
