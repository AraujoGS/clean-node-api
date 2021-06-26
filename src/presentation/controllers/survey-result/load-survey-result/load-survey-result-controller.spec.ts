import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest, mockLoadSurveyById } from './load-survey-result-controller-protocols'

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

describe('LoadSurveyResult Controller', () => {
  test('deve chamar o LoadSurveyById com os valores corretos', async () => {
    const loadSurveyById = mockLoadSurveyById()
    const sut = new LoadSurveyResultController(loadSurveyById)
    const loadByIdSpy = jest.spyOn(loadSurveyById, 'loadById')
    await sut.handle(mockRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
