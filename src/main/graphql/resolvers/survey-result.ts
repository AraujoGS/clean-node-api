import { adaptResolvers } from '@/main/adapters/apollo-server-resolvers-adapter'
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories/controllers'

export default {
  Query: {
    surveyResult: async (parent: any, args: any) => await adaptResolvers(makeLoadSurveyResultController(), args)
  },

  Mutation: {
    saveSurveyResult: async (parent: any, args: any) => await adaptResolvers(makeSaveSurveyResultController(), args)
  }
}
