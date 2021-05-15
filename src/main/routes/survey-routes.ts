import { Router } from 'express'
import { adaptRoutes } from '../adapters/express-routes-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-factory'

export default (router: Router): void => {
  router.post('/surveys', adaptRoutes(makeAddSurveyController()))
}
