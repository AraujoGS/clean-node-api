import { AddSurvey } from '@/domain/usecases'

export interface AddSurveyRepository {
  add: (survey: AddSurvey.Params) => Promise<void>
}
