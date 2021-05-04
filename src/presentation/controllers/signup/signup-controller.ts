import { HttpRequest, HttpResponse, Controller, Validation, Authentication } from './signup-controller-protocols'
import { badRequest, internalServerError, ok } from '../../helpers/http/http-helper'
import { AddAccount } from '../../../domain/usecases/add-account'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authenticatin: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const clientError = this.validation.validate(httpRequest.body)
      if (clientError) {
        return badRequest(clientError)
      }
      const { name, email, password } = httpRequest.body
      await this.addAccount.add({
        name,
        email,
        password
      })
      const accessToken = await this.authenticatin.auth({
        email,
        password
      })
      return ok({ accessToken })
    } catch (error) {
      return internalServerError(error)
    }
  }
}
