import { LoadSurveys } from '@/domain/usecases'

export interface LoadSurveysRepository {
  loadAll: (accountId: string) => Promise<LoadSurveys.Result>
}
