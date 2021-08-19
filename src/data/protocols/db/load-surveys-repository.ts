import { LoadSurveys } from '@/domain/usecases'

export namespace LoadSurveysRepository {
  export type Result = LoadSurveys.Result
}

export interface LoadSurveysRepository {
  loadAll: (accountId: string) => Promise<LoadSurveysRepository.Result>
}
