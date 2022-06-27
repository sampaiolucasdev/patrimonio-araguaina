# Executar JSON-SERVER

`yarn run json-server -w -p 3333 ./mock/database.json`

ou

Dentro de "scripts" no package.json, inserir:

`"mock": "yarn run json-server -w -p 3333 ./mock/database.json"`

E então executar apenas `yarn mock`
