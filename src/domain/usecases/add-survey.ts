import { SurveyModel } from '@/domain/models'

export namespace AddSurvey {
  export type Params = Omit<SurveyModel, 'id'>
}

export interface AddSurvey {
  add: (params: AddSurvey.Params) => Promise<void>
}
