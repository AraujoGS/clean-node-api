import { adaptResolvers } from '@/main/adapters/apollo-server-resolvers-adapter'
import { makeLoadSurveysController } from '@/main/factories/controllers'

export default {
  Query: {
    surveys: async () => await adaptResolvers(makeLoadSurveysController())
  }
}
