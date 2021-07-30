import { ValidationComposite } from '@/validation/validators'
import { MissingParamError } from '@/presentation/errors'
import { ValidationSpy } from '@/tests/validation/mocks'

type SutTypes = {
  sut: ValidationComposite
  validationSpys: ValidationSpy[]
}

const makeSut = (): SutTypes => {
  const validationSpys = [
    new ValidationSpy(),
    new ValidationSpy()
  ]
  const sut = new ValidationComposite(validationSpys)
  return {
    sut,
    validationSpys
  }
}

describe('Validation Composite', () => {
  test('deve retornar erro quando alguma das validações do composite retornar erro', () => {
    const { sut, validationSpys } = makeSut()
    // independente se a primeira ou a segunda validação falhar, um erro é retornado
    jest.spyOn(validationSpys[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_field' })
    expect(error).toEqual(new MissingParamError('field'))
  })
  test('deve retornar o primeiro erro que acontecer nas validações', () => {
    const { sut, validationSpys } = makeSut()
    jest.spyOn(validationSpys[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationSpys[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_field' })
    expect(error).toEqual(new Error())
  })
  test('não deve retornar erro quando a validação passar', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_field' })
    expect(error).toBeFalsy()
  })
})
