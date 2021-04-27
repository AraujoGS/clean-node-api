import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('any_token'))
  }
}))

describe('JWT Adapter', () => {
  test('deve chamar o sign do jwt com o valor correto', async () => {
    const secretKey = 'secret'
    const sut = new JwtAdapter(secretKey)
    const encryptSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(encryptSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })
  test('deve retornar um token em caso de sucesso no sign', async () => {
    const secretKey = 'secret'
    const sut = new JwtAdapter(secretKey)
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })
  test('deve lançar uma exceção caso o sign de algum erro', async () => {
    const secretKey = 'secret'
    const sut = new JwtAdapter(secretKey)
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})
