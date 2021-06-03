// arquivo de definição do typescrypt, com ele consigo estender o comportamento de lib existentes ou mesmo tipar uma lib que ainda não tem os tipos setados para o typescript
declare module Express {
  interface Request {
    accountId?: string
  }
}
