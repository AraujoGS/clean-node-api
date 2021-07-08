import { DbAddSurvey } from './db-add-survey'
import { throwError, mockAddSurveyParams } from '@/domain/test'
import { AddSurveyRepositorySpy } from '@/data/test'
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
