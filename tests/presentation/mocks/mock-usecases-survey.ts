import { SurveyModel } from '@/domain/models'
import { mockSurveysModel } from '@/tests/domain/mocks'
import { AddSurvey, AddSurveyParams, LoadSurveys } from '@/domain/usecases'

export class AddSurveySpy implements AddSurvey {
  addSurveyData: AddSurveyParams
  async add (data: AddSurveyParams): Promise<void> {
    this.addSurveyData = data
    return await Promise.resolve()
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveys = mockSurveysModel()
  accountId: string
  async load (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return await Promise.resolve(this.surveys)
  }
}
