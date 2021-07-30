import { HttpResponse } from '@/presentation/protocols'
import { internalServerError } from '@/presentation/helpers'
import faker from 'faker'

export const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = faker.random.words()
  return internalServerError(fakeError)
}
