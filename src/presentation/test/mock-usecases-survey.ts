import { SurveyModel } from '@/domain/models/survey'
import { mockSurveysModel } from '@/domain/test'
import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export class AddSurveySpy implements AddSurvey {
  addSurveyData: AddSurveyParams
  async add (data: AddSurveyParams): Promise<void> {
    this.addSurveyData = data
    return await Promise.resolve()
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveys = mockSurveysModel()
  callsCount = 0
  async load (): Promise<SurveyModel[]> {
    this.callsCount += 1
    return await Promise.resolve(this.surveys)
  }
}
