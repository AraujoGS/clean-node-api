import { AuthMiddleware } from './auth-middleware'
import { HttpRequest, LoadAccountByToken } from './auth-middleware-protocols'
import { throwError } from '@/domain/test'
import { forbidden, internalServerError, ok } from '@/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '@/presentation/errors/access-denied-error'
import { mockLoadAccountByToken } from '@/presentation/test'

const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('Deve retornar 403 se o header x-access-token não existir', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Deve chamar o LoadAccountByToken com o accessToken corretor', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })
  test('Deve retornar 403 se o LoadAccountByToken retornar nulo', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Deve retornar 200 se o LoadAccountByToken retornar uma conta', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
  })
  test('Deve retornar 500 se o LoadAccountByToken lançar uma exceção', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
})
