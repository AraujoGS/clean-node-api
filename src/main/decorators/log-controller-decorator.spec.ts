import { LogControllerDecorator } from './log-controller-decorator'
import { HttpRequest } from '@/presentation/protocols'
import { ok } from '@/presentation/helpers/http/http-helper'
import { mockAccountModel } from '@/domain/test'
import { LogErrorRepositorySpy } from '@/data/test'
import { mockServerError, ControllerSpy } from '@/main/test'

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
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)
  return {
    sut,
    controllerSpy,
    logErrorRepositorySpy
  }
}

describe('LogController Decorator', () => {
  test('Deve chamar o handle do controller decorado', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(controllerSpy.httpRequest).toEqual(httpRequest)
  })
  test('Deve o decorator retornar a mesma resposta do controller', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(mockAccountModel()))
  })
  test('Deve chamar o LogErrorRepository quando o controller responder com server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const error = mockServerError()
    jest.spyOn(controllerSpy, 'handle').mockReturnValueOnce(Promise.resolve(error))
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(logErrorRepositorySpy.stack).toBe('any_stack')
  })
})
