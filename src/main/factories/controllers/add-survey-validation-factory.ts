import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const fields = ['question', 'answers']
  const validations: Validation[] = []
  for (const fieldName of fields) {
    validations.push(new RequiredFieldValidation(fieldName))
  }
  return new ValidationComposite(validations)
}
