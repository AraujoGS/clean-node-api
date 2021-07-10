import { SurveyModel } from '@/domain/models/survey'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { mockSurveyModel, mockSurveyResultModel } from '@/domain/test'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'

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
  async load (surveyId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    return await Promise.resolve(this.surveyResult)
  }
}
