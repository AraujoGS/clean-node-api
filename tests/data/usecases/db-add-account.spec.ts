import { DbAddAccount } from '@/data/usecases'
import { mockAddAccountParams, throwError } from '@/tests/domain/mocks'
import { HasherSpy, AddAccountRepositorySpy, CheckAccountByEmailRepositorySpy } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const checkAccountByEmailRepositorySpy = new CheckAccountByEmailRepositorySpy()
  const sut = new DbAddAccount(
    hasherSpy,
    addAccountRepositorySpy,
    checkAccountByEmailRepositorySpy
  )

  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    checkAccountByEmailRepositorySpy
  }
}

describe('DbAddAccount Usecase', () => {
  test('Deve chamar o hasher passando a senha', async () => {
    const { sut, hasherSpy } = makeSut()
    const accountData = mockAddAccountParams()
    await sut.add(accountData)
    expect(hasherSpy.password).toBe(accountData.password)
  })
  test('Deve lançar qualquer exceção que ocorra no hasher e não tratar na classe', async () => {
    const { sut, hasherSpy } = makeSut()
    // mockando o retorno do método para lançar uma exceção
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError)
    const accountData = mockAddAccountParams()
    // pegando a promise retornada para realizar a asserção sobre ela
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
  test('Deve chamar o AddAccountRepository passando os valores corretos', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut()
    const accountData = mockAddAccountParams()
    await sut.add(accountData)
    expect(addAccountRepositorySpy.accountParams).toEqual({
      name: accountData.name,
      email: accountData.email,
      password: hasherSpy.result
    })
  })
  test('Deve lançar qualquer exceção que ocorra no addAccountRepository e não tratar na classe', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    // mockando o retorno do método para lançar uma exceção
    jest.spyOn(addAccountRepositorySpy, 'add').mockImplementationOnce(throwError)
    const accountData = mockAddAccountParams()
    // pegando a promise retornada para realizar a asserção sobre ela
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
  test('Deve retornar true caso a conta seja criada com caso de sucesso', async () => {
    const { sut } = makeSut()
    const accountData = mockAddAccountParams()
    const isValid = await sut.add(accountData)
    expect(isValid).toBe(true)
  })
  test('Deve retornar false caso a conta não seja criada com caso de sucesso', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    addAccountRepositorySpy.result = false
    const accountData = mockAddAccountParams()
    const isValid = await sut.add(accountData)
    expect(isValid).toBe(false)
  })
  test('deve retornar false caso o LoadAccountByEmailRepository retorne true', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    checkAccountByEmailRepositorySpy.result = true
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(false)
  })
  test('deve chamar o CheckAccountByEmailRepository com o email correto', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    const data = mockAddAccountParams()
    await sut.add(data)
    expect(checkAccountByEmailRepositorySpy.email).toBe(data.email)
  })
  test('deve lançar uma exceção caso o CheckAccountByEmailRepository de erro', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(checkAccountByEmailRepositorySpy, 'checkByEmail').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })
})
