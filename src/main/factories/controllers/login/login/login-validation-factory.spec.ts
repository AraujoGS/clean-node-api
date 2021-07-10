import { makeLoginValidation } from './login-validation-factory'
import { Validation } from '@/presentation/protocols'
import { ValidationComposite, EmailValidation, RequiredFieldValidation } from '@/validation/validators'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'

jest.mock('@/validation/validators/validation-composite')

describe('LoginValidation Factory', () => {
  test('deve chamar ValidationComposite com todas as validações', () => {
    makeLoginValidation()
    const fields = ['email', 'password']
    const validations: Validation[] = []
    for (const fieldName of fields) {
      validations.push(new RequiredFieldValidation(fieldName))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
