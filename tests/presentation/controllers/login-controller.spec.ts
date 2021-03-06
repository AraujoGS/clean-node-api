import { LoginController } from '@/presentation/controllers'
import { throwError } from '@/tests/domain/mocks'
import { badRequest, internalServerError, ok, unauthorized } from '@/presentation/helpers'
import { MissingParamError } from '@/presentation/errors'
import { AuthenticationSpy } from '@/tests/presentation/mocks'
import { ValidationSpy } from '@/tests/validation/mocks'
import faker from 'faker'

const mockRequest = (): LoginController.Request => ({
  email: faker.internet.email(),
  password: faker.random.word()
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
    const request = mockRequest()
    await sut.handle(request)
    expect(authenticationSpy.autheticationData).toEqual(request)
  })
  test('deve retornar 401 quando as credenciais são inválidas', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.result = null
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
    expect(httpResponse).toEqual(ok(authenticationSpy.result))
  })
  test('deve chamar o Validation com os valores corretos, ou seja, o dado que envio no request deve realmente ser utilizado', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })
  test('deve retornar 400 so o Validation retornar algum erro', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
