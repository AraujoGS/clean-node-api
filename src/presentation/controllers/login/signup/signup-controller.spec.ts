import { SignUpController } from './signup-controller'
import { throwError, mockAddAccountParams, mockAuthenticationParams } from '@/domain/test'
import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { ok, internalServerError, badRequest, forbidden } from '@/presentation/helpers/http/http-helper'
import { AddAccountSpy, AuthenticationSpy } from '@/presentation/test'
import { ValidationSpy } from '@/validation/test'

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
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
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(internalServerError(new ServerError(null)))
  })
  test('deve chamar AddAccount com os valores corretos, ou seja, o dado que envio no request deve realmente ser utilizado', async () => {
    const { sut, addAccountSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(addAccountSpy.accountData).toEqual(mockAddAccountParams())
  })
  test('deve chamar o Validation com os valores corretos, ou seja, o dado que envio no request deve realmente ser utilizado', async () => {
    const { sut, validationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validationSpy.input).toEqual(httpRequest.body)
  })
  test('deve retornar 200 se todos os dados informados estão corretos', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel))
  })
  test('deve retornar 403 se o email já estiver em uso', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockReturnValueOnce(Promise.resolve(null))
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })
  test('deve retornar 400 so o Validation retornar algum erro', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
  test('deve chamar o Authentication com os valores corretos', async () => {
    const { sut, authenticationSpy } = makeSut()
    await sut.handle(mockRequest())
    expect(authenticationSpy.autheticationData).toEqual(mockAuthenticationParams())
  })
  test('deve retornar 500 se o Authentication lançar uma exceção', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
})
