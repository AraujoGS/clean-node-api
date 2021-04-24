import { InvalidParamError } from '../../errors'
import { Validation } from './validation'

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldCompareToName: string

  constructor (fieldName: string, fieldCompareToName: string) {
    this.fieldName = fieldName
    this.fieldCompareToName = fieldCompareToName
  }

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldCompareToName]) {
      return new InvalidParamError(this.fieldCompareToName)
    }
  }
}
