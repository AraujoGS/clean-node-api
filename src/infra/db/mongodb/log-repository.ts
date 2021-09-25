import { LogErrorRepository } from '@/data/protocols/db'
import { MongoHelper } from '@/infra/db'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = MongoHelper.getCollection('errors')
    errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
