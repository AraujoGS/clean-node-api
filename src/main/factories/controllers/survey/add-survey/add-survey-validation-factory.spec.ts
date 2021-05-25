import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { Validation } from '@/presentation/protocols'
import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'

jest.mock('@/validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('deve chamar ValidationComposite com todas as validações', () => {
    makeAddSurveyValidation()
    const fields = ['question', 'answers']
    const validations: Validation[] = []
    for (const fieldName of fields) {
      validations.push(new RequiredFieldValidation(fieldName))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
