import { mockAccountModel } from '@/domain/test'
import { ok } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = ok(mockAccountModel())
      return await new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}
