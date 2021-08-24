import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { throwError } from '@/tests/domain/mocks'
import { LoadSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import faker from 'faker'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositorySpy)
  return {
    sut,
    loadSurveyByIdRepositorySpy
  }
}

const surveyId = faker.datatype.uuid()

describe('DbLoadAnswersBySurvey UseCase', () => {
  test('deve chamar o LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    await sut.loadAnswers(surveyId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })
  test('deve retornar as respostas da enquete em caso de sucesso', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([
      loadSurveyByIdRepositorySpy.survey.answers[0].answer,
      loadSurveyByIdRepositorySpy.survey.answers[1].answer
    ])
  })
  test('deve retornar um array vazio quando não encontra a enquete', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyByIdRepositorySpy.survey = null
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([])
  })
  test('deve lançar exceção caso o LoadSurveyByIdRepository de erro', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockImplementationOnce(throwError)
    const promise = sut.loadAnswers(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
