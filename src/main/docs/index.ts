import { loginPath } from './paths/login-path'
import { accountSchema } from './schemas/account-schema'
import { loginParamsSchema } from './schemas/login-params-schema'
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
  }], // podemos agrupar endpoints da documentação criando tags
  paths: {
    '/login': loginPath
  }, // são os endpoints que estamos documentando
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema
  } // são os modelos de dados usados nas respostas dos endpoints
}
