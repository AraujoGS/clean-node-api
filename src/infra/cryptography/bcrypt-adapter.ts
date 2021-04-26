import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/cryptography/encrypter'
export class BcryptAdapter implements Encrypter {
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

  async encrypt (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, 12)
    return hash
  }
}
