import { makeSignUpValidation } from './signup-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-fields-validation'
import { Validation } from '../../presentation/helpers/validators/validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignValidation Factory', () => {
  test('deve chamar ValidationComposite com todas as validações', () => {
    makeSignUpValidation()
    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    const validations: Validation[] = []
    for (const fieldName of fields) {
      validations.push(new RequiredFieldsValidation(fieldName))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
