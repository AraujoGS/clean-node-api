import { HttpRequest, HttpResponse, Controller, Validation, Authentication } from './signup-controller-protocols'
import { badRequest, forbidden, internalServerError, ok } from '../../../helpers/http/http-helper'
import { AddAccount } from '../../../../domain/usecases/add-account'
import { EmailInUseError } from '../../../errors'

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
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!account) {
        return forbidden(new EmailInUseError())
      }
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