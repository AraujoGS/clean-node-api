import { mockSurveysModel } from '@/tests/domain/mocks'
import { AddSurvey, LoadSurveys } from '@/domain/usecases'

export class AddSurveySpy implements AddSurvey {
  addSurveyData: AddSurvey.Params
  async add (data: AddSurvey.Params): Promise<void> {
    this.addSurveyData = data
    return await Promise.resolve()
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  result = mockSurveysModel()
  accountId: string
  async load (accountId: string): Promise<LoadSurveys.Result> {
    this.accountId = accountId
    return await Promise.resolve(this.result)
  }
}
