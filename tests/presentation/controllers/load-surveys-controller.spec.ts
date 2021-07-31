import { LoadSurveysController } from '@/presentation/controllers'
import { throwError } from '@/tests/domain/mocks'
import { internalServerError, ok, noContent } from '@/presentation/helpers'
import { LoadSurveysSpy } from '@/tests/presentation/mocks'
import MockDate from 'mockdate'
import faker from 'faker'

const mockRequest = (): LoadSurveysController.Request => ({ accountId: faker.datatype.uuid() })

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysSpy: LoadSurveysSpy
}

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy()
  const sut = new LoadSurveysController(loadSurveysSpy)
  return {
    sut,
    loadSurveysSpy
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => MockDate.set(new Date()))

  afterAll(() => MockDate.reset())

  test('deve chamar o LoadSurveys', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveysSpy.accountId).toBe(request.accountId)
  })
  test('deve retornar 200 em caso de sucesso', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadSurveysSpy.surveys))
  })
  test('deve retornar 204 se não tiver nenhuma enquete', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    loadSurveysSpy.surveys = []
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
  test('deve retornar 500 caso o LoadSurveys lance exceção', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    jest.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
})
