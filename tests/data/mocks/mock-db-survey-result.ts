import { SaveSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols/db'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  saveSurveyResultParams: SaveSurveyResultRepository.Params
  async save (data: SaveSurveyResultRepository.Params): Promise<void> {
    this.saveSurveyResultParams = data
    return await Promise.resolve()
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyResult = mockSurveyResultModel()
  surveyId: string
  accountId: string
  async loadBySurveyId (surveyId: string, accountId: string): Promise<LoadSurveyResultRepository.Result> {
    this.surveyId = surveyId
    this.accountId = accountId
    return await Promise.resolve(this.surveyResult)
  }
}
