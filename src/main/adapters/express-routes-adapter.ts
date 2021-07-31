import { Controller } from '@/presentation/protocols'
import { Request, RequestHandler, Response } from 'express'

export const adaptRoutes = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    const request = {
      ...(req.body || {}),
      ...(req.params || {}),
      accountId: req.accountId
    }
    const httpResponse = await controller.handle(request)
    if ([200, 201, 203, 204].includes(httpResponse.statusCode)) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
    }
  }
}
