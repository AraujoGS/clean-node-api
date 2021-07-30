import { Decrypter, Encrypter } from '@/data/protocols/cryptography'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secretKey: string) {}

  async encrypt (value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secretKey)
    return accessToken
  }

  async decrypt (value: string): Promise<string> {
    const valueDecrypted: any = await jwt.verify(value, this.secretKey)
    return valueDecrypted
  }
}
