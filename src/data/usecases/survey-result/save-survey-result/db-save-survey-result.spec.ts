import { DbSaveSurveyResult } from './db-save-survey-result'
import { throwError, mockSaveSurveyResultParams } from '@/domain/test'
import { SaveSurveyResultRepositorySpy, LoadSurveyResultRepositorySpy } from '@/data/test'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositorySpy, loadSurveyResultRepositorySpy)
  return {
    sut,
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => MockDate.set(new Date()))

  afterAll(() => MockDate.reset())

  test('deve chamar o SaveSurveyResultRepository com os valores corretos', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    const data = mockSaveSurveyResultParams()
    await sut.save(data)
    expect(saveSurveyResultRepositorySpy.saveSurveyResultParams).toBe(data)
  })
  test('deve chamar o LoadSurveyResultRepository com os valores corretos', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const data = mockSaveSurveyResultParams()
    await sut.save(data)
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(data.surveyId)
    expect(loadSurveyResultRepositorySpy.accountId).toBe(data.accountId)
  })
  test('deve lançar exceção caso algum erro aconteça no SaveSurveyResultRepository', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(saveSurveyResultRepositorySpy, 'save').mockImplementationOnce(throwError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })
  test('deve lançar exceção caso algum erro aconteça no LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })
  test('deve retornar um SurveyResult em caso de sucesso', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.save(mockSaveSurveyResultParams())
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.surveyResult)
  })
})
