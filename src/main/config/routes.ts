import { Express, Router } from 'express'
import fg from 'fast-glob'
export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  // obtendo todos os arquivos de rotas, iterando sobre eles importando e executando a função exportada como default
  fg.sync('**/src/main/routes/**routes.ts').map(async file => (await import(`../../../${file}`)).default(router))
}
