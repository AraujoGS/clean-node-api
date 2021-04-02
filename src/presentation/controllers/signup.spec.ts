import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('deve retornar 400 se o name não for informado', () => {
    // sut - System under test, ou seja, indica qual classe ou arquivo está sendo testado
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  })
  test('deve retornar 400 se o email não for informado', () => {
    // sut - System under test, ou seja, indica qual classe ou arquivo está sendo testado
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: email'))
  })
})
