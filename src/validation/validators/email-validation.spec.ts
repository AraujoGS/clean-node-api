import { EmailValidation } from './email-validation'
import { throwError } from '@/domain/test'
import { InvalidParamError } from '@/presentation/errors'
import { EmailValidatorSpy } from '@/validation/test'

type SutTypes = {sut: EmailValidation, emailValidatorSpy: EmailValidatorSpy}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation('email', emailValidatorSpy)
  return {
    sut,
    emailValidatorSpy
  }
}

describe('Email Validation', () => {
  test('deve retornar um erro se o email não for válido', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    // utilizando o jest para interceptar a execução do método 'isValid' e alterando seu valor chumbado para false
    jest.spyOn(emailValidatorSpy, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'any_email@mail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })
  test('deve chamar o EmailValidator com o email correto', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    sut.validate({ email: 'any_email@mail.com' })
    expect(emailValidatorSpy.email).toBe('any_email@mail.com')
  })
  test('deve retornar um erro se o EmailValidator lançar uma exceção', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    // Interceptando o emailValidatorSpy.isValid e modificando sua implementação
    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(throwError)
    expect(sut.validate).toThrow()
  })
})
