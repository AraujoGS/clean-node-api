import { LoadSurveyResult } from '@/domain/usecases'

export interface LoadSurveyResultRepository {
  loadBySurveyId: (surveyId: string, accountId: string) => Promise<LoadSurveyResult.Result>
}
