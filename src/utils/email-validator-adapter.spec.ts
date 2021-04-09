import { EmailValidatorAdapter } from './email-validator'
describe('EmailValidator Adapter', () => {
  test('Deve retornar false se o validador retornar falso', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
})
