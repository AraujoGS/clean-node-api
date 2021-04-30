export default {
  mongoUri: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-node-api',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'lSp109-+bnQ*86Ax$@z'
}
