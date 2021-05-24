import { adaptRoutes } from '@/main/adapters/express-routes-adapter'
import { adminAuth } from '@/main/middlewares/admin-auth'
import { auth } from '@/main/middlewares/auth'
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-factory'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoutes(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoutes(makeLoadSurveysController()))
}
