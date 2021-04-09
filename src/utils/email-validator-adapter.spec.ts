import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

/**
 * Crio um mock do método da lib externa usado na implementação para garantir o retorno
 * independente da regra usada nela, ou seja, eu não preciso saber o que a lib considera
 * um e-mail válido ou inválido, para o meu teste eu preciso de um cenário onde retorne
 * true e outro onde retorne false.
 */
jest.mock('validator', () => ({
  isEmail (): boolean { return true }
}))

describe('EmailValidator Adapter', () => {
  test('Deve retornar false se o validador retornar falso', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
  test('Deve retornar true se o validador retornar verdadeiro', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })
})
