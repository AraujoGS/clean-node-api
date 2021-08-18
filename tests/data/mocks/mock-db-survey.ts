import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data/protocols/db'
import { LoadSurveyById, LoadSurveys } from '@/domain/usecases'
import { mockSurveyModel, mockSurveysModel } from '@/tests/domain/mocks'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurveyRepository.Params
  async add (surveyData: AddSurveyRepository.Params): Promise<void> {
    this.addSurveyParams = surveyData
    return await Promise.resolve()
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  survey = mockSurveyModel()
  id: string
  async loadById (id: string): Promise<LoadSurveyById.Result> {
    this.id = id
    return await Promise.resolve(this.survey)
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveys = mockSurveysModel()
  accountId: string
  async loadAll (accountId: string): Promise<LoadSurveys.Result> {
    this.accountId = accountId
    return await Promise.resolve(this.surveys)
  }
}
