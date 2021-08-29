import { LoadAnswersBySurvey, SaveSurveyResult, LoadSurveyResult, CheckSurveyById } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'
import faker from 'faker'

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
  result = [faker.random.word(), faker.random.word()]
  id: string
  async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
    this.id = id
    return await Promise.resolve(this.result)
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
  result = mockSurveyResultModel()
  saveSurveyResultData: SaveSurveyResult.Params
  async save (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    this.saveSurveyResultData = data
    return await Promise.resolve(this.result)
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  result = mockSurveyResultModel()
  surveyId: string
  accountId: string
  async load (surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId
    this.accountId = accountId
    return await Promise.resolve(this.result)
  }
}
