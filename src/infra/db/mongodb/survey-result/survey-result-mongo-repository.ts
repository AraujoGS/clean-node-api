import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel, MongoHelper } from './survey-result-mongo-repository-protocols'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const res = await surveyResultCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true, // por padrão o metodo busca e atualiza, com essa flag caso não exista ele insere
      returnOriginal: false // por padrão o metodo retorna os dados iniciais e nao os atualizados, com isso ele retorna o atualizado
    })
    return res.value && MongoHelper.map(res.value)
  }
}
