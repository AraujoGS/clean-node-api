import { LogControllerDecorator } from './log-controller-decorator'
import { Controller, HttpRequest } from '@/presentation/protocols'
import { ok } from '@/presentation/helpers/http/http-helper'
import { mockAccountModel } from '@/domain/test'
import { LogErrorRepositorySpy } from '@/data/test'
import { mockServerError, mockController } from '@/main/test'

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const makeSut = (): SutTypes => {
  const controllerStub = mockController()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositorySpy)
  return {
    sut,
    controllerStub,
    logErrorRepositorySpy
  }
}

describe('LogController Decorator', () => {
  test('Deve chamar o handle do controller decorado', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
  test('Deve o decorator retornar a mesma resposta do controller', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(mockAccountModel()))
  })
  test('Deve chamar o LogErrorRepository quando o controller responder com server error', async () => {
    const { sut, controllerStub, logErrorRepositorySpy } = makeSut()
    const error = mockServerError()
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error))
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(logErrorRepositorySpy.stack).toBe('any_stack')
  })
})
