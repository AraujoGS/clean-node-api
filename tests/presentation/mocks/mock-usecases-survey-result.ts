import { SurveyModel, SurveyResultModel } from '@/domain/models'
import { LoadSurveyById, SaveSurveyResult, SaveSurveyResultParams, LoadSurveyResult } from '@/domain/usecases'
import { mockSurveyModel, mockSurveyResultModel } from '@/tests/domain/mocks'

export class LoadSurveyByIdSpy implements LoadSurveyById {
  survey = mockSurveyModel()
  id: string
  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return await Promise.resolve(this.survey)
  }
}

export class SaveSurveyResultSpy implements SaveSurveyResult {
  surveyResult = mockSurveyResultModel()
  saveSurveyResultData: SaveSurveyResultParams
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.saveSurveyResultData = data
    return await Promise.resolve(this.surveyResult)
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyResult = mockSurveyResultModel()
  surveyId: string
  accountId: string
  async load (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    this.accountId = accountId
    return await Promise.resolve(this.surveyResult)
  }
}
