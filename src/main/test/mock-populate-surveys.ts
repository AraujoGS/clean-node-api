import { Collection } from 'mongodb'

export const mockSurveysCollection = async (collection: Collection): Promise<void> => {
  await collection.insertMany([
    {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    },
    {
      question: 'other_question',
      answers: [{
        image: 'other_image',
        answer: 'other_answer'
      }],
      date: new Date()
    }
  ])
}