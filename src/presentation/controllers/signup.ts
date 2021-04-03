import { HttpRequest, HttpResponse } from '../protocols/http'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, internalServerError } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFiels = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFiels) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return internalServerError()
    }
  }
}
