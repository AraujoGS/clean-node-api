import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoutes } from '../adapters/express-routes-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-factory'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  const auth = adaptMiddleware(makeAuthMiddleware())
  router.post('/surveys', adminAuth, adaptRoutes(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoutes(makeLoadSurveysController()))
}
