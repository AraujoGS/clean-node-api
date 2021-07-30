import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { Validation } from '@/presentation/protocols/validation'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const makeLoginValidation = (): ValidationComposite => {
  const fields = ['email', 'password']
  const validations: Validation[] = []
  for (const fieldName of fields) {
    validations.push(new RequiredFieldValidation(fieldName))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
