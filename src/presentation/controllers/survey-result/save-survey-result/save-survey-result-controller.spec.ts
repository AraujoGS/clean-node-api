import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest } from './save-survey-result-controller-protocols'
import { throwError } from '@/domain/test'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, internalServerError, ok } from '@/presentation/helpers/http/http-helper'
import { LoadSurveyByIdSpy, SaveSurveyResultSpy } from '@/presentation/test'
import MockDate from 'mockdate'
import faker from 'faker'

const mockRequest = (answer: string): HttpRequest => ({
  params: {
    surveyId: faker.datatype.uuid()
  },
  body: {
    answer
  },
  accountId: faker.datatype.uuid()
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(loadSurveyByIdSpy, saveSurveyResultSpy)
  return {
    sut,
    loadSurveyByIdSpy,
    saveSurveyResultSpy
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => MockDate.set(new Date()))

  afterAll(() => MockDate.reset())

  test('deve chamar o LoadSurveyById com os valores corretos', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const request = mockRequest(faker.datatype.string())
    await sut.handle(request)
    expect(loadSurveyByIdSpy.id).toBe(request.params.surveyId)
  })
  test('deve retornar 403 se o LoadSurveyById retornar nulo', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const request = mockRequest(faker.datatype.string())
    loadSurveyByIdSpy.survey = null
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  test('deve retornar 403 se for informado uma resposta que não pertence a enquete selecionada', async () => {
    const { sut } = makeSut()
    const request = mockRequest(faker.datatype.string())
    const httpResponse = await sut.handle({
      params: {
        surveyId: request.params.surveyId
      },
      body: {
        answer: faker.random.words()
      }
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })
  test('deve retornar 500 caso o LoadSurveyById lance exceção', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const request = mockRequest(faker.datatype.string())
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
  test('deve chamar o SaveSurveyResult com os valores corretos', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()
    const request = mockRequest(loadSurveyByIdSpy.survey.answers[0].answer)
    await sut.handle(request)
    expect(saveSurveyResultSpy.saveSurveyResultData).toEqual({
      surveyId: request.params.surveyId,
      accountId: request.accountId,
      answer: request.body.answer,
      date: new Date()
    })
  })
  test('deve retornar 500 caso o SaveSurveyResult lance exceção', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({
      params: {
        surveyId: loadSurveyByIdSpy.survey.id
      },
      body: {
        answer: loadSurveyByIdSpy.survey.answers[0].answer
      },
      accountId: faker.datatype.uuid()
    })
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
  test('deve retornar 200 em caso de sucesso', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()
    const httpResponse = await sut.handle({
      params: {
        surveyId: loadSurveyByIdSpy.survey.id
      },
      body: {
        answer: loadSurveyByIdSpy.survey.answers[0].answer
      },
      accountId: faker.datatype.uuid()
    })
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResult))
  })
})
