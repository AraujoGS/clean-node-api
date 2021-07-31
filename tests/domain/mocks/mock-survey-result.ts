import { SaveSurveyResult } from '@/domain/usecases'
import faker from 'faker'

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => ({
  surveyId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
  answer: faker.random.words(),
  date: new Date()
})

export const mockSurveyResultModel = (): SaveSurveyResult.Result => ({
  surveyId: faker.datatype.uuid(),
  answers: [{
    answer: faker.random.words(),
    count: faker.datatype.number(),
    percent: faker.datatype.number(100),
    isCurrentAccountAnswer: faker.datatype.boolean()
  }, {
    answer: faker.random.words(),
    count: faker.datatype.number(),
    percent: faker.datatype.number(100),
    image: faker.image.imageUrl(),
    isCurrentAccountAnswer: faker.datatype.boolean()
  }],
  date: new Date(),
  question: faker.random.words()
})

export const mockEmptySurveyResultModel = (): SaveSurveyResult.Result => ({
  surveyId: faker.datatype.uuid(),
  answers: [{
    answer: faker.random.words(),
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: false
  }, {
    answer: faker.random.words(),
    count: 0,
    percent: 0,
    image: faker.image.imageUrl(),
    isCurrentAccountAnswer: false
  }],
  date: new Date(),
  question: faker.random.words()
})
