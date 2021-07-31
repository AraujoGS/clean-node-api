import { LogControllerDecorator } from '@/main/decorators'
import { LogErrorRepositorySpy } from '@/tests/data/mocks'
import { mockServerError, ControllerSpy } from '@/tests/main/mocks'
import faker from 'faker'

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
    const request = faker.lorem.sentence()// como é um decorator e o que interessa é que o valor que chega seja repassado corretamente, eu uso qualquer valor
    await sut.handle(request)
    expect(controllerSpy.request).toEqual(request)
  })
  test('Deve o decorator retornar a mesma resposta do controller', async () => {
    const { sut, controllerSpy } = makeSut()
    const request = faker.lorem.sentence()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })
  test('Deve chamar o LogErrorRepository quando o controller responder com server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const error = mockServerError()
    jest.spyOn(controllerSpy, 'handle').mockReturnValueOnce(Promise.resolve(error))
    const request = faker.lorem.sentence()
    await sut.handle(request)
    expect(logErrorRepositorySpy.stack).toBe(error.body.stack)
  })
})
