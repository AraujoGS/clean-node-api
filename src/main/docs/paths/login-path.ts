export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'API para autenticar usuários',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      },
      400: {
        description: 'Erro no cliente'
      },
      401: {
        description: 'Erro na autorização'
      },
      500: {
        description: 'Erro no servidor'
      }
    }
  }
}
