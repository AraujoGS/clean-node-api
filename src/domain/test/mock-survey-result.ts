import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  answers: [{
    answer: 'any_answer',
    count: 1,
    percent: 50
  }, {
    answer: 'other_answer',
    count: 10,
    percent: 80,
    image: 'any_image'
  }],
  date: new Date(),
  question: 'any_question'
})

export const mockEmptySurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  answers: [{
    answer: 'any_answer',
    count: 0,
    percent: 0
  }, {
    answer: 'other_answer',
    count: 0,
    percent: 0,
    image: 'any_image'
  }],
  date: new Date(),
  question: 'any_question'
})
