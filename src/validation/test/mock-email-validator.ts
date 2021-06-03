import { EmailValidator } from '@/validation/protocols/email-validator'

export const mockEmailValidator = (): EmailValidator => {
  // Stub é um tipo de mock onde o retorno é um valor chumbado, fixo
  class EmailValidatorStub implements EmailValidator {
    /**
     * uma boa prática em teste unitário, é que o mock retorne o caminho feliz.
     * deve ser interceptada sua execução e modificado o valor para falhar somente
     * no teste necessario
     */
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
