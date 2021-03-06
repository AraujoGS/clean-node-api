import { Hasher, HashComparer, Decrypter, Encrypter } from '@/data/protocols/cryptography'
import faker from 'faker'

export class HasherSpy implements Hasher {
  result: string = faker.datatype.uuid()
  password: string
  async hash (value: string): Promise<string> {
    this.password = value
    return await Promise.resolve(this.result)
  }
}

export class HashComparerSpy implements HashComparer {
  result: boolean = true
  comparedValue: string
  hash: string
  async compare (value: string, hash: string): Promise<boolean> {
    this.comparedValue = value
    this.hash = hash
    return await Promise.resolve(this.result)
  }
}

export class DecrypterSpy implements Decrypter {
  result: string = faker.datatype.string(10)
  encryptedValue: string
  async decrypt (value: string): Promise<string> {
    this.encryptedValue = value
    return await Promise.resolve(this.result)
  }
}

export class EncrypterSpy implements Encrypter {
  result: string = faker.datatype.string(10)
  value: string
  async encrypt (value: string): Promise<string> {
    this.value = value
    return await Promise.resolve(this.result)
  }
}
