# definindo a versão do node que meu container vai utilizar. Outras versões em: https://hub.docker.com/_/node
FROM node:14
# A pasta aonde meus arquivos publicados, meu pacote vai ficar.
WORKDIR /usr/src/clean-node-api
# copiando o package.json da minha pasta do projeto para a raiz do docker
COPY ./package.json .
# executando o comando de instalação dos pacotes no meu docker, somente dependências de produção
RUN npm i --only=prod
# copiando a pasta dist gerada no meu build para uma pasta no container
COPY ./dist ./dist
# informar qual porta meu projeto vai estar exposto
EXPOSE 5000
# executando o projeto
CMD npm start
