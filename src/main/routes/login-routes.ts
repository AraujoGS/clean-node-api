import { Router } from 'express'
import { adaptRoutes } from '../adapters/express/express-routes-adapter'
import { makeSignUpController } from '../factories/signup/signup-factory'

/**
 * Agrupo nesse arquivo tudo ligado a autenticação, poderia criar um arquivo por rota, mas por
 * opção vamos colocar tudo ligado a autenticação aqui (ex: Login, SignUp, logout, reset de senha e etc...)
 */

export default (router: Router): void => {
  router.post('/signup', adaptRoutes(makeSignUpController()))
}