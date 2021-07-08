import { DbAddAccount } from './db-add-account'
import { mockAccountModel, mockAddAccountParams, throwError } from '@/domain/test'
import { HasherSpy, AddAccountRepositorySpy, LoadAccountByEmailRepositorySpy } from '@/data/test'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  loadAccountByEmailRepositorySpy.account = null
  const sut = new DbAddAccount(
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
  )

  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
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
      password: hasherSpy.hashedPassword
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
  test('Deve retornar a conta criada em caso de sucesso', async () => {
    const { sut } = makeSut()
    const accountData = mockAddAccountParams()
    const account = await sut.add(accountData)
    expect(account).toEqual(mockAccountModel())
  })
  test('deve retornar null caso o LoadAccountByEmailRepository retorne null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockReturnValueOnce(Promise.resolve(mockAccountModel()))
    const account = await sut.add(mockAddAccountParams())
    expect(account).toBeNull()
  })
  test('deve chamar o LoadAccountByEmailRepository com o email correto', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const data = mockAddAccountParams()
    await sut.add(data)
    console.log(loadAccountByEmailRepositorySpy.email)
    expect(loadAccountByEmailRepositorySpy.email).toBe(data.email)
  })
  test('deve lançar uma exceção caso o LoadAccountByEmailRepository de erro', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })
})
