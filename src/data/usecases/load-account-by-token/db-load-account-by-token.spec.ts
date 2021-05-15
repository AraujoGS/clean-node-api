import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
describe('DbLoadAccountByToken UseCase', () => {
  test('deve chamar o Decrypter com o valor correto', async () => {
    class DecrypterStub implements Decrypter {
      async decrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve('any_value'))
      }
    }
    const decrypterStub = new DecrypterStub()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const sut = new DbLoadAccountByToken(decrypterStub)
    await sut.loadByToken('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
