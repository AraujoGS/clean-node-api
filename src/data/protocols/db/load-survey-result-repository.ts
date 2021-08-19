import { LoadSurveyResult } from '@/domain/usecases'

export namespace LoadSurveyResultRepository {
  export type Result = LoadSurveyResult.Result
}

export interface LoadSurveyResultRepository {
  loadBySurveyId: (surveyId: string, accountId: string) => Promise<LoadSurveyResultRepository.Result>
}
