import { badRequest, unauthorized, internalServerError, notFound, forbidden } from './components'
import { accountSchema, addSurveyParamsSchema, apiKeyAuthSchema, errorSchema, loginParamsSchema, signUpParamsSchema, surveyAnswerSchema, surveySchema, surveysSchema } from './schemas'
import { loginPath, loadSurveysPath, signUpPath, addSurveyPath } from './paths'
export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do curso do Mango para realizar enquetes entre programadores.',
    version: '1.0.0'
  },
  servers: [{
    url: '/api' // por padrão ele ja considera a url em que essa aplicação está rodando, no caso de local seria o http://localhost...
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Enquete'
  }], // podemos agrupar endpoints da documentação criando tags
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': { ...loadSurveysPath, ...addSurveyPath } // como os dois endpoints possuem a mesma URL mesclei os arquivos separados
  }, // são os endpoints que estamos documentando
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    signUpParams: signUpParamsSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveys: surveysSchema,
    addSurveyParams: addSurveyParamsSchema,
    error: errorSchema
  }, // são os modelos de dados usados nas respostas dos endpoints
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    unauthorized,
    internalServerError,
    notFound,
    forbidden
  } // são tipos de respostas que partilham o mesmo schema
}
