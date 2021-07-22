import { HttpRequest } from './login-controller-protocols'
import { LoginController } from './login-controller'
import { throwError } from '@/domain/test'
import { badRequest, internalServerError, ok, unauthorized } from '@/presentation/helpers/http/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { AuthenticationSpy } from '@/presentation/test'
import { ValidationSpy } from '@/validation/test'
import faker from 'faker'

const mockRequest = (): HttpRequest => ({
  body: {
    email: faker.internet.email(),
    password: faker.random.word()
  }
})

type SutTypes = {
  sut: LoginController
  authenticationSpy: AuthenticationSpy
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationSpy = new ValidationSpy()
  const sut = new LoginController(authenticationSpy, validationSpy)
  return {
    sut,
    authenticationSpy,
    validationSpy
  }
}

describe('Login Controller', () => {
  test('deve chamar o Authentication com os valores corretos', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(authenticationSpy.autheticationData).toEqual({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })
  test('deve retornar 401 quando as credenciais são inválidas', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.authenticationModel = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
  test('deve retornar 500 se o Authentication lançar uma exceção', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
  test('deve retornar 200 quando as credenciais são válidas', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel))
  })
  test('deve chamar o Validation com os valores corretos, ou seja, o dado que envio no request deve realmente ser utilizado', async () => {
    const { sut, validationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validationSpy.input).toEqual(httpRequest.body)
  })
  test('deve retornar 400 so o Validation retornar algum erro', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
