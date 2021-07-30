import { LogControllerDecorator } from '@/main/decorators'
import { HttpRequest } from '@/presentation/protocols'
import { LogErrorRepositorySpy } from '@/tests/data/mocks'
import { mockServerError, ControllerSpy } from '@/tests/main/mocks'
import faker from 'faker'

const mockRequest = (): HttpRequest => ({
  body: {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.random.word(),
    passwordConfirmation: faker.random.word()
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
    const { sut, controllerSpy } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })
  test('Deve chamar o LogErrorRepository quando o controller responder com server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const error = mockServerError()
    jest.spyOn(controllerSpy, 'handle').mockReturnValueOnce(Promise.resolve(error))
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(logErrorRepositorySpy.stack).toBe(error.body.stack)
  })
})
