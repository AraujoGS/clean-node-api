/**
 * Camada responsável pela instanciação das classes que criamos,
 * faz a composição de tudo que foi criado, realiza as injeções de dependência
 * necessárias e sobe nosso servidor (API)
*/
import express from 'express'
const app = express()

app.listen(5050, () => console.log('server running at http://localhost:5050'))
