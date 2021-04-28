import { HttpRequest, HttpResponse, Controller, Validation } from './signup-controller-protocols'
import { badRequest, internalServerError, ok } from '../../helpers/http/http-helper'
import { AddAccount } from '../../../domain/usecases/add-account'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
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

      return ok(account)
    } catch (error) {
      return internalServerError(error)
    }
  }
}
