import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultModel, SurveyResultModel, SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import MockDate from 'mockdate'

const makeFakeSaveSurveyResultData = (): SaveSurveyResultModel => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel => Object.assign({}, makeFakeSaveSurveyResultData(), { id: 'any_id' })

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => MockDate.set(new Date()))

  afterAll(() => MockDate.reset())

  test('deve chamar o SaveSurveyResultRepository com os valores corretos', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    await sut.save(makeFakeSaveSurveyResultData())
    expect(saveSpy).toHaveBeenCalledWith(makeFakeSaveSurveyResultData())
  })
  test('deve lançar exceção caso algum erro aconteça no SaveSurveyResultRepository', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.save(makeFakeSaveSurveyResultData())
    await expect(promise).rejects.toThrow()
  })
})
