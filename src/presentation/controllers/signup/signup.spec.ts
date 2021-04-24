import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel, Validation } from './signup-protocols'
import { HttpRequest } from '../../protocols'
import { ok, internalServerError, badRequest } from '../../helpers/http-helper'

const makeEmailValidator = (): EmailValidator => {
  // Stub é um tipo de mock onde o retorno é um valor chumbado, fixo
  class EmailValidatorStub implements EmailValidator {
    /**
     * uma boa prática em teste unitário, é que o mock retorne o caminho feliz.
     * deve ser interceptada sua execução e modificado o valor para falhar somente
     * no teste necessario
     */
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()

      return await new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeFakeAnyRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

interface SutTypes {sut: SignUpController, emailValidatorStub: EmailValidator, addAccountStub: AddAccount, validationStub: Validation}

// sut - System under test, ou seja, indica qual classe ou arquivo está sendo testado
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  test('deve retornar 400 se o email não for válido', async () => {
    const { sut, emailValidatorStub } = makeSut()
    // utilizando o jest para interceptar a execução do método 'isValid' e alterando seu valor chumbado para false
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeAnyRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
  test('deve chamar o EmailValidator com o email correto, ou seja, o dado que envio no request deve realmente ser utilizado', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeAnyRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('deve retornar 500 se o EmailValidator lançar uma exceção', async () => {
    const { sut, emailValidatorStub } = makeSut()
    // Interceptando o emailValidatorStub.isValid e modificando sua implementação
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeFakeAnyRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(internalServerError(new ServerError(null)))
  })
  test('deve retornar 500 se o AddAccount lançar uma exceção', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeFakeAnyRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(internalServerError(new ServerError(null)))
  })
  test('deve chamar AddAccount com os valores corretos, ou seja, o dado que envio no request deve realmente ser utilizado', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeAnyRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
  test('deve chamar o Validation com os valores corretos, ou seja, o dado que envio no request deve realmente ser utilizado', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeAnyRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('deve retornar 200 se todos os dados informados estão corretos', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeAnyRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
  test('deve retornar 400 so o Validation retornar algum erro', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = makeFakeAnyRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
