import { DbAddSurvey } from '@/data/usecases'
import { throwError, mockAddSurveyParams } from '@/tests/domain/mocks'
import { AddSurveyRepositorySpy } from '@/tests/data/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositorySpy: AddSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(addSurveyRepositorySpy)
  return {
    sut,
    addSurveyRepositorySpy
  }
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => MockDate.set(new Date()))

  afterAll(() => MockDate.reset())

  test('deve chamar o AddSurveyRepository com os valores corretos', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    const data = mockAddSurveyParams()
    await sut.add(data)
    expect(addSurveyRepositorySpy.addSurveyParams).toBe(data)
  })
  test('deve lançar exceção caso algum erro aconteça no AddSurveyRespository', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    jest.spyOn(addSurveyRepositorySpy, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
