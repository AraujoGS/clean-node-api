import env from '../config/env'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'

export const mockAccessToken = async (collection: Collection): Promise<string> => {
  const res = await collection.insertOne({
    name: 'Guilherme',
    email: 'guilhermearaujo421@gmail.com',
    password: '123',
    role: 'admin'
  })
  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await collection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}
