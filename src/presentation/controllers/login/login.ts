import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, internalServerError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../../protocols/email-validator'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFiels = ['email', 'password']

      for (const field of requiredFiels) {
        if (!httpRequest.body[field]) {
          return await new Promise(resolve => resolve(badRequest(new MissingParamError(field))))
        }
      }
      const { email } = httpRequest.body

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return await new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
      }
    } catch (error) {
      return internalServerError(error)
    }
  }
}
