import { LoadSurveyById, SaveSurveyResult, LoadSurveyResult, CheckSurveyById } from '@/domain/usecases'
import { mockSurveyModel, mockSurveyResultModel } from '@/tests/domain/mocks'

export class LoadSurveyByIdSpy implements LoadSurveyById {
  survey = mockSurveyModel()
  id: string
  async loadById (id: string): Promise<LoadSurveyById.Result> {
    this.id = id
    return await Promise.resolve(this.survey)
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  result = true
  id: string
  async checkById (id: string): Promise<CheckSurveyById.Result> {
    this.id = id
    return await Promise.resolve(this.result)
  }
}

export class SaveSurveyResultSpy implements SaveSurveyResult {
  surveyResult = mockSurveyResultModel()
  saveSurveyResultData: SaveSurveyResult.Params
  async save (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    this.saveSurveyResultData = data
    return await Promise.resolve(this.surveyResult)
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyResult = mockSurveyResultModel()
  surveyId: string
  accountId: string
  async load (surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId
    this.accountId = accountId
    return await Promise.resolve(this.surveyResult)
  }
}
