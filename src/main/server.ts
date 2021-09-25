/**
 * Camada responsável pela instanciação das classes que criamos,
 * faz a composição de tudo que foi criado, realiza as injeções de dependência
 * necessárias e sobe nosso servidor (API)
*/
import 'module-alias/register'
import env from './config/env'
import { MongoHelper } from '@/infra/db'

MongoHelper.connect(env.mongoUri)
  .then(async () => {
    // somente após conectar no mongodb dou listen no meu servidor.
    const { setupApp } = await import('./config/app')
    const app = await setupApp()
    app.listen(env.port, () => console.log(`server running at http://localhost:${env.port}`))
  }).catch(console.error)
