import { JwtAdapter } from '@/infra/cryptography'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('any_token')
  },

  async verify (): Promise<string> {
    return await Promise.resolve('any_value')
  }
}))

const makeSut = (): JwtAdapter => {
  const secretKey = 'secret'
  return new JwtAdapter(secretKey)
}

describe('JWT Adapter', () => {
  describe('sign()', () => {
    test('deve chamar o sign do jwt com os valores corretos', async () => {
      const sut = makeSut()
      const encryptSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(encryptSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })
    test('deve retornar um token em caso de sucesso no sign', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })
    test('deve lançar uma exceção caso o sign de algum erro', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('deve chamar o verify do jwt com os valores corretos', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })
    test('deve retornar um valor em caso de sucesso no verify', async () => {
      const sut = makeSut()
      const value = await sut.decrypt('any_token')
      expect(value).toBe('any_value')
    })
    test('deve lançar uma exceção caso o verify de algum erro', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.decrypt('any_token')
      await expect(promise).rejects.toThrow()
    })
  })
})
