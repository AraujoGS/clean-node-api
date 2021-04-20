/**
 * Decorator é um design pattern que consiste em adicionar comportamentos a um objeto
 * existente em tempo de execução.
 * É envolver um objeto com outro do mesmo tipo (Liskov Principle) e acrescer comportamentos a ele
 */

import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller

  constructor (controller: Controller) {
    this.controller = controller
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    return httpResponse
  }
}
