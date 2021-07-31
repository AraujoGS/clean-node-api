import { mockAccountModel } from '@/tests/domain/mocks'
import { ok } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class ControllerSpy implements Controller {
  httpResponse = ok(mockAccountModel())
  request: any
  async handle (request: any): Promise<HttpResponse> {
    this.request = request
    return await Promise.resolve(this.httpResponse)
  }
}
