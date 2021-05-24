import { adaptRoutes } from '@/main/adapters/express-routes-adapter'
import { makeSignUpController } from '@/main/factories/controllers/login/signup/signup-factory'
import { makeLoginController } from '@/main/factories/controllers/login/login/login-factory'
import { Router } from 'express'

/**
 * Agrupo nesse arquivo tudo ligado a autenticação, poderia criar um arquivo por rota, mas por
 * opção vamos colocar tudo ligado a autenticação aqui (ex: Login, SignUp, logout, reset de senha e etc...)
 */

export default (router: Router): void => {
  router.post('/signup', adaptRoutes(makeSignUpController()))
  router.post('/login', adaptRoutes(makeLoginController()))
}
