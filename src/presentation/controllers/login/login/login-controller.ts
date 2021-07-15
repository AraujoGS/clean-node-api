import { Controller, HttpRequest, HttpResponse, Validation, Authentication } from './login-controller-protocols'
import { badRequest, internalServerError, ok, unauthorized } from '@/presentation/helpers/http/http-helper'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const clientError = this.validation.validate(httpRequest.body)
      if (clientError) {
        return badRequest(clientError)
      }
      const { email, password } = httpRequest.body
      const authenticationModel = await this.authentication.auth({ email, password })
      if (!authenticationModel) {
        return unauthorized()
      }
      return ok(authenticationModel)
    } catch (error) {
      return internalServerError(error)
    }
  }
}
