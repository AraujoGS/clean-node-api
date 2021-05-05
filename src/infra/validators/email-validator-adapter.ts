import { EmailValidator } from '../../validation/protocols/email-validator'
import validator from 'validator'

/**
 * Implementação do email validator, utilizando o padrão Adapter
 * Nele independente de qual lib eu use para validar email, o meu código está desacoplado dela,
 * caso queira mudar para outra ou implementar minha propria regra, basta alterar esse adapter para que
 * a validação funcione.
 */

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
