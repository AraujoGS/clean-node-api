import { LoadSurveysController } from './load-surveys-controller'
import { throwError, mockSurveysModel } from '@/domain/test'
import { internalServerError, ok, noContent } from '@/presentation/helpers/http/http-helper'
import { LoadSurveysSpy } from '@/presentation/test'
import MockDate from 'mockdate'

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
    await sut.handle({})
    expect(loadSurveysSpy.callsCount).toBe(1)
  })
  test('deve retornar 200 em caso de sucesso', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(mockSurveysModel()))
  })
  test('deve retornar 204 se não tiver nenhuma enquete', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    jest.spyOn(loadSurveysSpy, 'load').mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })
  test('deve retornar 500 caso o LoadSurveys lance exceção', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    jest.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
})
