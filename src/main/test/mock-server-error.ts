import { HttpResponse } from '@/presentation/protocols'
import { internalServerError } from '@/presentation/helpers/http/http-helper'

export const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return internalServerError(fakeError)
}
