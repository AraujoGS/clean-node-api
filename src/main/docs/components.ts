import { badRequest, unauthorized, internalServerError, notFound, forbidden } from './components/'
import { apiKeyAuthSchema } from './schemas/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  unauthorized,
  internalServerError,
  notFound,
  forbidden
}
