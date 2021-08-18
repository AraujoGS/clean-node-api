import { AddSurvey } from '@/domain/usecases'

export namespace AddSurveyRepository {
  export type Params = AddSurvey.Params
}

export interface AddSurveyRepository {
  add: (survey: AddSurveyRepository.Params) => Promise<void>
}
