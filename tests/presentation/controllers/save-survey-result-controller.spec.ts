import { SaveSurveyResultController } from '@/presentation/controllers'
import { throwError } from '@/tests/domain/mocks'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, internalServerError, ok } from '@/presentation/helpers'
import { LoadAnswersBySurveySpy, SaveSurveyResultSpy } from '@/tests/presentation/mocks'
import MockDate from 'mockdate'
import faker from 'faker'

const mockRequest = (answer: string): SaveSurveyResultController.Request => ({
  surveyId: faker.datatype.uuid(),
  answer,
  accountId: faker.datatype.uuid()
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadAnswersBySurveySpy: LoadAnswersBySurveySpy
  saveSurveyResultSpy: SaveSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveySpy = new LoadAnswersBySurveySpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(loadAnswersBySurveySpy, saveSurveyResultSpy)
  return {
    sut,
    loadAnswersBySurveySpy,
    saveSurveyResultSpy
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => MockDate.set(new Date()))

  afterAll(() => MockDate.reset())

  test('deve chamar o LoadAnswersBySurvey com os valores corretos', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    const request = mockRequest(faker.datatype.string())
    await sut.handle(request)
    expect(loadAnswersBySurveySpy.id).toBe(request.surveyId)
  })
  test('deve retornar 403 se o LoadAnswersBySurvey retornar um array vazio', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    const request = mockRequest(faker.datatype.string())
    loadAnswersBySurveySpy.result = []
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  test('deve retornar 403 se for informado uma resposta que não pertence a enquete selecionada', async () => {
    const { sut } = makeSut()
    const request = mockRequest(faker.datatype.string())
    const httpResponse = await sut.handle({
      surveyId: request.surveyId,
      answer: faker.random.words(),
      accountId: request.accountId
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })
  test('deve retornar 500 caso o LoadAnswersBySurvey lance exceção', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    const request = mockRequest(faker.datatype.string())
    jest.spyOn(loadAnswersBySurveySpy, 'loadAnswers').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
  test('deve chamar o SaveSurveyResult com os valores corretos', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut()
    const request = mockRequest(loadAnswersBySurveySpy.result[0])
    await sut.handle(request)
    expect(saveSurveyResultSpy.saveSurveyResultData).toEqual({
      surveyId: request.surveyId,
      accountId: request.accountId,
      answer: request.answer,
      date: new Date()
    })
  })
  test('deve retornar 500 caso o SaveSurveyResult lance exceção', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({
      surveyId: loadAnswersBySurveySpy.id,
      answer: loadAnswersBySurveySpy.result[0],
      accountId: faker.datatype.uuid()
    })
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
  test('deve retornar 200 em caso de sucesso', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut()
    const httpResponse = await sut.handle({
      surveyId: loadAnswersBySurveySpy.id,
      answer: loadAnswersBySurveySpy.result[0],
      accountId: faker.datatype.uuid()
    })
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.result))
  })
})
