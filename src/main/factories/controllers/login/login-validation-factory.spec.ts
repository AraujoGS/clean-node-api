import { ValidationComposite, EmailValidation, RequiredFieldValidation } from '../../../../presentation/helpers/validators'
import { makeLoginValidation } from './login-validation-factory'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'

jest.mock('../../../../presentation/helpers/validators/validation-composite')

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
    makeLoginValidation()
    const fields = ['email', 'password']
    const validations: Validation[] = []
    for (const fieldName of fields) {
      validations.push(new RequiredFieldValidation(fieldName))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
