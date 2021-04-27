import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

describe('JWT Adapter', () => {
  test('deve chamar o sign do jwt com o valor correto ', async () => {
    const secretKey = 'secret'
    const sut = new JwtAdapter(secretKey)
    const encryptSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(encryptSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })
})
