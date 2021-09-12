import { Controller } from '@/presentation/protocols'

export const adaptResolvers = async (controller: Controller, args: any): Promise<any> => {
  const httpResponse = await controller.handle(args)
  return httpResponse.body
}
