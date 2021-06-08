import {
  accountSchema,
  addSurveyParamsSchema,
  errorSchema,
  loginParamsSchema,
  signUpParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
  surveyResultSchema,
  saveSurveyResultParamsSchema
} from './schemas/'

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  surveys: surveysSchema,
  addSurveyParams: addSurveyParamsSchema,
  surveyResult: surveyResultSchema,
  saveSurveyResultParams: saveSurveyResultParamsSchema,
  error: errorSchema
}
