import { Collection } from 'mongodb'
import faker from 'faker'

export const mockSurveysCollection = async (collection: Collection): Promise<void> => {
  await collection.insertMany([
    {
      question: faker.random.words(),
      answers: [{
        image: faker.image.imageUrl(),
        answer: faker.random.words()
      }],
      date: new Date()
    },
    {
      question: faker.random.words(),
      answers: [{
        image: faker.image.imageUrl(),
        answer: faker.random.words()
      }],
      date: new Date()
    }
  ])
}
