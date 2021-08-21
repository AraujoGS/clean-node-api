import { ok } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'
import faker from 'faker'

export class ControllerSpy implements Controller {
  httpResponse = ok(faker.datatype.uuid())
  request: any
  async handle (request: any): Promise<HttpResponse> {
    this.request = request
    return await Promise.resolve(this.httpResponse)
  }
}
