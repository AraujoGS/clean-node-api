export const badRequest = {
  description: 'Erro no cliente',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
