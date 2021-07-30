import { adaptRoutes } from '@/main/adapters'
import { makeSaveSurveyResultController, makeLoadSurveyResultController } from '@/main/factories/controllers'
import { auth } from '@/main/middlewares'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoutes(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', auth, adaptRoutes(makeLoadSurveyResultController()))
}
