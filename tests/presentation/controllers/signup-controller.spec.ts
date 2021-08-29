import { SignUpController } from '@/presentation/controllers'
import { throwError, mockAddAccountParams } from '@/tests/domain/mocks'
import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors'
import { ok, internalServerError, badRequest, forbidden } from '@/presentation/helpers'
import { AddAccountSpy, AuthenticationSpy } from '@/tests/presentation/mocks'
import { ValidationSpy } from '@/tests/validation/mocks'
import faker from 'faker'

const mockRequest = (): SignUpController.Request => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.random.word(),
  passwordConfirmation: faker.random.word()
})

type SutTypes = {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

// sut - System under test, ou seja, indica qual classe ou arquivo está sendo testado
const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy()
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new SignUpController(addAccountSpy, validationSpy, authenticationSpy)
  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy
  }
}

describe('SignUp Controller', () => {
  test('deve retornar 500 se o AddAccount lançar uma exceção', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(throwError)
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(internalServerError(new ServerError(null)))
  })
  test('deve chamar AddAccount com os valores corretos, ou seja, o dado que envio no request deve realmente ser utilizado', async () => {
    const { sut, addAccountSpy } = makeSut()
    const params = mockAddAccountParams()
    const request = {
      name: params.name,
      email: params.email,
      password: params.password,
      passwordConfirmation: params.password
    }
    await sut.handle(request)
    expect(addAccountSpy.accountData).toEqual(params)
  })
  test('deve chamar o Validation com os valores corretos, ou seja, o dado que envio no request deve realmente ser utilizado', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })
  test('deve retornar 200 se todos os dados informados estão corretos', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(authenticationSpy.result))
  })
  test('deve retornar 403 se o email já estiver em uso', async () => {
    const { sut, addAccountSpy } = makeSut()
    addAccountSpy.result = false
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })
  test('deve retornar 400 so o Validation retornar algum erro', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
  test('deve chamar o Authentication com os valores corretos', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(authenticationSpy.autheticationData).toEqual({
      email: request.email,
      password: request.password
    })
  })
  test('deve retornar 500 se o Authentication lançar uma exceção', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
})
