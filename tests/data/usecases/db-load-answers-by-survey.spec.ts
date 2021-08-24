import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { throwError } from '@/tests/domain/mocks'
import { LoadAnswersBySurveyRepositorySpy } from '@/tests/data/mocks'
import faker from 'faker'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepository: LoadAnswersBySurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepository = new LoadAnswersBySurveyRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepository)
  return {
    sut,
    loadAnswersBySurveyRepository
  }
}

const surveyId = faker.datatype.uuid()

describe('DbLoadAnswersBySurvey UseCase', () => {
  test('deve chamar o LoadSurveyByIdRepository', async () => {
    const { sut, loadAnswersBySurveyRepository } = makeSut()
    await sut.loadAnswers(surveyId)
    expect(loadAnswersBySurveyRepository.id).toBe(surveyId)
  })
  test('deve retornar as respostas da enquete em caso de sucesso', async () => {
    const { sut, loadAnswersBySurveyRepository } = makeSut()
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual(loadAnswersBySurveyRepository.result)
  })
  test('deve retornar um array vazio quando não encontra a enquete', async () => {
    const { sut, loadAnswersBySurveyRepository } = makeSut()
    loadAnswersBySurveyRepository.result = []
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([])
  })
  test('deve lançar exceção caso o LoadSurveyByIdRepository de erro', async () => {
    const { sut, loadAnswersBySurveyRepository } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepository, 'loadAnswers').mockImplementationOnce(throwError)
    const promise = sut.loadAnswers(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
