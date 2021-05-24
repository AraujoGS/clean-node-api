import { LogErrorRepository, MongoHelper } from './log-repository-protocols'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
