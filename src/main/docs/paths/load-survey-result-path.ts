export const loadSurveyResultPath = {
  get: {
    tags: ['Enquete'],
    summary: 'API para consultar as respostas de uma enquete',
    security: [{
      apiKeyAuth: []
    }],
    parameters: [{
      in: 'path',
      name: 'surveyId',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/internalServerError'
      }
    }
  }
}
