import { LoadSurveyById } from '@/domain/usecases'

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<LoadSurveyById.Result>
}
