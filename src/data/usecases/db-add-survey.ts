import { AddSurvey } from '@/domain/usecases'
import { AddSurveyRepository } from '@/data/protocols/db'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}
  async add (params: AddSurvey.Params): Promise<void> {
    await this.addSurveyRepository.add(params)
  }
}
