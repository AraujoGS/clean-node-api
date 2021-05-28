import { AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, SurveyModel, AddSurveyModel, MongoHelper } from './survey-mongo-repository-protocols'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return surveys.length ? surveys.map(survey => MongoHelper.map(survey)) : []
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: id })
    return survey
  }
}
