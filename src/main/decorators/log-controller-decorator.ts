/**
 * Decorator é um design pattern que consiste em adicionar comportamentos a um objeto
 * existente em tempo de execução.
 * É envolver um objeto com outro do mesmo tipo (Liskov Principle) e acrescer comportamentos a ele
 */

import { LogErrorRepository } from '@/data/protocols/db'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle (request: any): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(request)
    // Adicionando o comportamento de log aos meus controllers
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
