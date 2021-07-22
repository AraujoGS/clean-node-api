import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyByIdRepositorySpy, LoadSurveyResultRepositorySpy } from '@/data/test'
import { throwError } from '@/domain/test'
import MockDate from 'mockdate'
import faker from 'faker'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy)
  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  }
}

let surveyId: string
let accountId: string

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => MockDate.set(new Date()))

  beforeEach(() => {
    surveyId = faker.datatype.uuid()
    accountId = faker.datatype.uuid()
  })

  afterAll(() => MockDate.reset())

  test('deve chamar o LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    await sut.load(surveyId, accountId)
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId)
    expect(loadSurveyResultRepositorySpy.accountId).toBe(accountId)
  })
  test('deve lançar exceção caso algum erro aconteça no LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.load(surveyId, accountId)
    await expect(promise).rejects.toThrow()
  })
  test('deve chamar o LoadSurveyByIdRepository quando o LoadSurveyResultRepository retornar null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyResultRepositorySpy.surveyResult = null
    await sut.load(surveyId, accountId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })
  test('deve lançar exceção caso algum erro aconteça no LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyResultRepositorySpy.surveyResult = null
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockImplementationOnce(throwError)
    const promise = sut.load(surveyId, accountId)
    await expect(promise).rejects.toThrow()
  })
  test('deve retornar as respostas com count e percent 0 quando não existem respostas', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyResultRepositorySpy.surveyResult = null
    const survey = loadSurveyByIdRepositorySpy.survey
    const surveyResult = await sut.load(surveyId, accountId)
    expect(surveyResult).toEqual({
      surveyId,
      question: survey.question,
      date: survey.date,
      answers: survey.answers.map(answer => Object.assign({}, answer, { count: 0, percent: 0, isCurrentAccountAnswer: false }))
    })
  })
  test('deve retornar as respostas da enquete', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.load(surveyId, accountId)
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.surveyResult)
  })
})
