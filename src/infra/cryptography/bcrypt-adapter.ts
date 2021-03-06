import { HashComparer, Hasher } from '@/data/protocols/cryptography'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashComparer {
  /**
   * O salt é uma caracteristica especifica da lib Bcrypt, outros encriptadores
   * não necessáriamente vão possuir essa propriedade, por isso ela é uma dependência
   * injetada no construtor da classe que implementa o Bcrypt e não na interface
   * que ele assina
  */
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, 12)
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
