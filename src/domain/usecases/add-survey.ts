import { SurveyAnswersModel } from '@/domain/models/survey'

export type AddSurveyModel = {
  question: string
  answers: SurveyAnswersModel[]
  date: Date
}

export type AddSurvey = {
  add: (data: AddSurveyModel) => Promise<void>
}
