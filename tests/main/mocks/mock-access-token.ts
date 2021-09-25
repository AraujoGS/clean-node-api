import env from '@/main/config/env'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import faker from 'faker'

export const mockAccessToken = async (collection: Collection): Promise<string> => {
  const res = await collection.insertOne({
    name: faker.datatype.string(),
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(),
    role: 'admin'
  })
  const id = res.insertedId.toHexString()
  const accessToken = sign({ id }, env.jwtSecret)
  await collection.updateOne({
    _id: res.insertedId
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}
