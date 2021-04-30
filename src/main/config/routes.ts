import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join, resolve } from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  // obtendo todos os arquivos de rotas, iterando sobre eles importando e executando a função exportada como default
  const dirName = resolve(__dirname)
  const path = join(dirName, '../routes')
  readdirSync(path).map(async file => {
    if (!file.includes('.test.')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
