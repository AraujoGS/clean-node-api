import { LoadSurveyById } from '@/domain/usecases'

export namespace LoadSurveyByIdRepository {
  export type Result = LoadSurveyById.Result
}

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<LoadSurveyByIdRepository.Result>
}
