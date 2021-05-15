import { ValidationComposite, RequiredFieldValidation, EmailValidation, CompareFieldsValidation } from '../../../../../validation/validators'
import { makeSignUpValidation } from './signup-validation-factory'
import { Validation } from '../../../../../presentation/protocols'
import { EmailValidator } from '../../../../../validation/protocols/email-validator'

jest.mock('../../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('SignValidation Factory', () => {
  test('deve chamar ValidationComposite com todas as validações', () => {
    makeSignUpValidation()
    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    const validations: Validation[] = []
    for (const fieldName of fields) {
      validations.push(new RequiredFieldValidation(fieldName))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
