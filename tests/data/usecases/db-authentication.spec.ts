import { DbAuthentication } from '@/data/usecases'
import { throwError, mockAuthenticationParams } from '@/tests/domain/mocks'
import { EncrypterSpy, HashComparerSpy, LoadAccountByEmailRepositorySpy, UpdateAccessTokenRepositorySpy } from '@/tests/data/mocks'

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
    loadAccountByEmailRepositorySpy.result = null
    const model = await sut.auth(mockAuthenticationParams())
    expect(model).toBeNull()
  })
  test('deve chamar o HashComparer com os valores corretos', async () => {
    const { sut, hashComparerSpy, loadAccountByEmailRepositorySpy } = makeSut()
    const data = mockAuthenticationParams()
    await sut.auth(data)
    expect(hashComparerSpy.comparedValue).toBe(data.password)
    expect(hashComparerSpy.hash).toBe(loadAccountByEmailRepositorySpy.result.password)
  })
  test('deve lançar uma exceção caso o HashComparer de erro', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
  test('deve retornar null caso o HashComparer retorne false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    hashComparerSpy.isValid = false
    const model = await sut.auth(mockAuthenticationParams())
    expect(model).toBeNull()
  })
  test('deve chamar o Encrypter com o id correto', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()
    const data = mockAuthenticationParams()
    await sut.auth(data)
    expect(encrypterSpy.value).toBe(loadAccountByEmailRepositorySpy.result.id)
  })
  test('deve lançar uma exceção caso o Encrypter de erro', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError)
    const data = mockAuthenticationParams()
    const promise = sut.auth(data)
    await expect(promise).rejects.toThrow()
  })
  test('deve retornar o AuthenticationModel em caso de sucesso', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()
    const model = await sut.auth(mockAuthenticationParams())
    expect(model.accessToken).toBe(encrypterSpy.encryptedValue)
    expect(model.name).toBe(loadAccountByEmailRepositorySpy.result.name)
  })
  test('deve chamar o UpdateAccessTokenRepository com os valores corretos', async () => {
    const { sut, updateAccessTokenRepositorySpy, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()
    const data = mockAuthenticationParams()
    await sut.auth(data)
    expect(updateAccessTokenRepositorySpy.id).toBe(loadAccountByEmailRepositorySpy.result.id)
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.encryptedValue)
  })
  test('deve lançar uma exceção caso o UpdateAccessTokenRepository de erro', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    jest.spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
})
