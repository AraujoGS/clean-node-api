import { SurveyModel } from '@/domain/models'
import { AddSurvey } from '@/domain/usecases'
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

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: faker.random.words(),
  answers: [{
    image: faker.image.imageUrl(),
    answer: faker.random.words()
  }],
  date: new Date()
})
