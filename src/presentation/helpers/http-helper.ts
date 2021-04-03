import { ServerError } from '../errors/server-error'
import { HttpResponse } from '../protocols/http'
export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}

export const internalServerError = (): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError()
  }
}
