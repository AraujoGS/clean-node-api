import { DbAuthentication } from './db-authentication'
import { throwError, mockAuthenticationParams } from '@/domain/test'
import { EncrypterSpy, HashComparerSpy, LoadAccountByEmailRepositorySpy, UpdateAccessTokenRepositorySpy } from '@/data/test'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  )
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('DbAuthentication UseCase', () => {
  test('deve chamar o LoadAccountByEmailRepository com o email correto', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const data = mockAuthenticationParams()
    await sut.auth(data)
    expect(loadAccountByEmailRepositorySpy.email).toBe(data.email)
  })
  test('deve lançar uma exceção caso o LoadAccountByEmailRepository de erro', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
  test('deve retornar null caso o LoadAccountByEmailRepository retorne null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockReturnValueOnce(null)
    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBeNull()
  })
  test('deve chamar o HashComparer com os valores corretos', async () => {
    const { sut, hashComparerSpy } = makeSut()
    const data = mockAuthenticationParams()
    await sut.auth(data)
    expect(hashComparerSpy.comparedValue).toBe(data.password)
    expect(hashComparerSpy.hash).toBe(data.password)
  })
  test('deve lançar uma exceção caso o HashComparer de erro', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
  test('deve retornar null caso o HashComparer retorne false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBeNull()
  })
  test('deve chamar o Encrypter com o id correto', async () => {
    const { sut, encrypterSpy } = makeSut()
    const data = mockAuthenticationParams()
    await sut.auth(data)
    expect(encrypterSpy.value).toBe('any_id')
  })
  test('deve lançar uma exceção caso o Encrypter de erro', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError)
    const data = mockAuthenticationParams()
    const promise = sut.auth(data)
    await expect(promise).rejects.toThrow()
  })
  test('deve retornar o accessToken em caso de sucesso', async () => {
    const { sut, encrypterSpy } = makeSut()
    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBe(encrypterSpy.encryptedValue)
  })
  test('deve chamar o UpdateAccessTokenRepository com os valores corretos', async () => {
    const { sut, updateAccessTokenRepositorySpy, encrypterSpy } = makeSut()
    const data = mockAuthenticationParams()
    await sut.auth(data)
    expect(updateAccessTokenRepositorySpy.id).toBe('any_id')
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.encryptedValue)
  })
  test('deve lançar uma exceção caso o UpdateAccessTokenRepository de erro', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    jest.spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
})
