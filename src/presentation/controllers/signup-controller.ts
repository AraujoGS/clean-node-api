import { AddAccount, Authentication } from '@/domain/usecases'
import { badRequest, forbidden, internalServerError, ok } from '@/presentation/helpers'
import { EmailInUseError } from '@/presentation/errors'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'

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
