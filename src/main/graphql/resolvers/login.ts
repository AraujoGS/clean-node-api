import { adaptResolvers } from '@/main/adapters/apollo-server-resolvers-adapter'
import { makeLoginController, makeSignUpController } from '@/main/factories/controllers'

export default {
  Query: {
    login: async (parent: any, args: any) => await adaptResolvers(makeLoginController(), args)
  },

  Mutation: {
    signUp: async (parent: any, args: any) => await adaptResolvers(makeSignUpController(), args)
  }
}
