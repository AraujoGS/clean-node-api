import { InvalidParamError } from '@/presentation/errors'
import { forbidden, internalServerError, ok } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { LoadSurveyById, SaveSurveyResult } from '@/domain/usecases'

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    answer: string
    accountId: string
  }
}

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyId: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId, answer } = request
      const survey = await this.loadSurveyId.loadById(surveyId)
      if (survey) {
        const validAnswer = survey.answers.map(a => a.answer)
          .some(a => a === answer)

        if (!validAnswer) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        date: new Date()
      })
      return ok(surveyResult)
    } catch (error) {
      return internalServerError(error)
    }
  }
}
