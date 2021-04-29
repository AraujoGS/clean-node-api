export default {
  mongoUri: process.env.MONGO_URL || 'mongodb://suaconexaocomomongodb',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'seuSecret'
}
