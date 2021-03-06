import { setupApp } from '@/main/config/app'
import { Express } from 'express'
import request from 'supertest'
let app: Express = null

describe('Content-Type Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })
  test('Deve retornar por default com json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/) // utilizo uma regex porque o content-type json pode ser passado de muitas formas, por esse motivo caso o header tenha a palavra json consideramos válido
  })
  test('Deve retornar forçando o retorno xml', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send()
    })
    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
