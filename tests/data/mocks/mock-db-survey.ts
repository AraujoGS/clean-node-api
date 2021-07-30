import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data/protocols/db'
import { AddSurveyParams } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'
import { mockSurveyModel, mockSurveysModel } from '@/tests/domain/mocks'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurveyParams
  async add (surveyData: AddSurveyParams): Promise<void> {
    this.addSurveyParams = surveyData
    return await Promise.resolve()
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  survey = mockSurveyModel()
  id: string
  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return await Promise.resolve(this.survey)
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveys = mockSurveysModel()
  accountId: string
  async loadAll (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return await Promise.resolve(this.surveys)
  }
}
