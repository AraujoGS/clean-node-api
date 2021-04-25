import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => new CompareFieldsValidation('field', 'fieldToCompare')

describe('CompareFields Validation', () => {
  test('deve retornar InvalidParamError se a validação falhar', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })
  test('não deve retornar se a validação passar', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })
    expect(error).toBeFalsy()
  })
})
