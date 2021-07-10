import { EmailValidator } from '@/validation/protocols/email-validator'

export class EmailValidatorSpy implements EmailValidator {
  email: string
  isValid (email: string): boolean {
    this.email = email
    return true
  }
}
