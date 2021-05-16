import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoutes } from '../adapters/express-routes-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const adminAccess = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAccess, adaptRoutes(makeAddSurveyController()))
}
