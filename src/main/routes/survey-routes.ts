import { adaptRoutes } from '@/main/adapters'
import { adminAuth, auth } from '@/main/middlewares'
import { makeAddSurveyController, makeLoadSurveysController } from '@/main/factories/controllers'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoutes(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoutes(makeLoadSurveysController()))
}
