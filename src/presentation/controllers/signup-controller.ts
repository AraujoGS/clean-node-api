import { AddAccount, Authentication } from '@/domain/usecases'
import { badRequest, forbidden, internalServerError, ok } from '@/presentation/helpers'
import { EmailInUseError } from '@/presentation/errors'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export namespace SignUpController {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authenticatin: Authentication
  ) {}

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const clientError = this.validation.validate(request)
      if (clientError) {
        return badRequest(clientError)
      }
      const { name, email, password } = request
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!account) {
        return forbidden(new EmailInUseError())
      }
      const authenticationModel = await this.authenticatin.auth({
        email,
        password
      })
      return ok(authenticationModel)
    } catch (error) {
      return internalServerError(error)
    }
  }
}
