export const unauthorized = {
  description: 'Erro na autorização do usuário',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
