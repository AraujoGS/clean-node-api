import { SurveyModel } from '@/domain/models'

export type AddSurveyParams = Omit<SurveyModel, 'id'>

export type AddSurvey = {
  add: (data: AddSurveyParams) => Promise<void>
}
