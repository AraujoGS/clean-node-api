import { adaptRoutes } from '@/main/adapters/express-routes-adapter'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-factory'
import { makeLoadSurveyResultController } from '@/main/factories/controllers/survey-result/load-survey-result/load-survey-result-factory'
import { auth } from '@/main/middlewares/auth'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoutes(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', auth, adaptRoutes(makeLoadSurveyResultController()))
}
