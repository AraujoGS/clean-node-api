import { EmailValidation } from './email-validation'
import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'

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

interface SutTypes {sut: EmailValidation, emailValidatorStub: EmailValidator}

// sut - System under test, ou seja, indica qual classe ou arquivo está sendo testado
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  test('deve retornar um erro se o email não for válido', async () => {
    const { sut, emailValidatorStub } = makeSut()
    // utilizando o jest para interceptar a execução do método 'isValid' e alterando seu valor chumbado para false
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'any_email@mail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })
  test('deve chamar o EmailValidator com o email correto', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'any_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('deve retornar um erro se o EmailValidator lançar uma exceção', async () => {
    const { sut, emailValidatorStub } = makeSut()
    // Interceptando o emailValidatorStub.isValid e modificando sua implementação
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
