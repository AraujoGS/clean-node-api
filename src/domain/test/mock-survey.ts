import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import faker from 'faker'
export const mockSurveyModel = (): SurveyModel => ({
  id: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [{
    answer: faker.random.words()
  }, {
    image: faker.image.imageUrl(),
    answer: faker.random.words()
  }],
  date: new Date()
})

export const mockSurveysModel = (): SurveyModel[] => ([
  {
    id: faker.datatype.uuid(),
    question: faker.random.words(),
    answers: [{
      image: faker.image.imageUrl(),
      answer: faker.random.words()
    }],
    date: new Date()
  },
  {
    id: faker.datatype.uuid(),
    question: faker.random.words(),
    answers: [{
      image: faker.image.imageUrl(),
      answer: faker.random.words()
    }],
    date: new Date()
  }
])

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: faker.random.words(),
  answers: [{
    image: faker.image.imageUrl(),
    answer: faker.random.words()
  }],
  date: new Date()
})
