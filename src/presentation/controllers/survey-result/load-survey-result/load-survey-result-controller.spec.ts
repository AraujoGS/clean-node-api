import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest } from './load-survey-result-controller-protocols'
import { throwError, mockSurveyResultModel } from '@/domain/test'
import { LoadSurveyByIdSpy, LoadSurveyResultSpy } from '@/presentation/test'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, internalServerError, ok } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(loadSurveyByIdSpy, loadSurveyResultSpy)
  return {
    sut,
    loadSurveyByIdSpy,
    loadSurveyResultSpy
  }
}

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => MockDate.set(new Date()))

  afterAll(() => MockDate.reset())

  test('deve chamar o LoadSurveyById com os valores corretos', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    await sut.handle(mockRequest())
    expect(loadSurveyByIdSpy.id).toBe('any_id')
  })
  test('deve retornar 403 se o LoadSurveyById retornar null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  test('deve retornar 500 se o LoadSurveyById der erro', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
  test('deve chamar o LoadSurveyResult com os valores corretos', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    await sut.handle(mockRequest())
    expect(loadSurveyResultSpy.surveyId).toBe('any_id')
  })
  test('deve retornar 500 se o LoadSurveyResult der erro', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    jest.spyOn(loadSurveyResultSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
  test('deve retornar 200 em caso de sucesso', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
