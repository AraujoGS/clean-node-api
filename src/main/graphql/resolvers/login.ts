import { adaptResolvers } from '@/main/adapters/apollo-server-resolvers-adapter'
import { makeLoginController } from '@/main/factories/controllers'

export default {
  Query: {
    login: (parent: any, args: any): any => adaptResolvers(makeLoginController(), args)
  }
}
