import { SaveSurveyResult } from '@/domain/usecases'

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResult.Params) => Promise<void>
}
