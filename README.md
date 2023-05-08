# **Projeto BexUp**
Teste BEXUP:

Tempo do teste 40 Minutos.

1. Backend
2. FrontEnd




1 .BackEnd:

1. Criar um serviço REST na API-1 para acionar a ”carga” dos dados de veículos.

2. Implementar a lógica na API-1 para buscar as "marcas" no serviço da  FIPE (https://deividfortuna.github.io/fipe/).

3. Configurar uma “Fila” para receber as "marcas" da API-1 e enviar uma por vez para a API-2 para processamento assíncrono.

4. Implementar a lógica na API-2 para buscar os "códigos" e "modelos" dos veículos no serviço da FIPE com base nas "marcas" recebidas da fila.

5. Implementar a lógica na API-2 para salvar no banco de dados relacional as informações de "código", "marca" e "modelo" dos veículos encontrados no serviço da FIPE.

6. Criar um serviço REST na API-1 para buscar as "marcas" armazenadas no banco de dados.

7. Criar um serviço REST na API-1 para buscar os "códigos", "modelos" e “observações” dos veículos por "marca" no banco de dados.

8. Criar um serviço REST na API-2 para salvar os dados alterados do veículo, como: "modelo" e “observações”  no banco de dados.

## Banco de dados
### iniciando 
docker-compose up
### troubleshotting / deletar containers para reinicializar 
docker compose rm

## Configuracoes pub/sub
### gcloud pubsub topics create queue_bex
### gcloud pubsub subscriptions create subscription_name --topic queue_bex



## INICIANDO APIS

#### API-1 
```javascript
    cd api1
    npm start
```
#### API-1 
```javascript
    cd api2
    npm start
```


## EXECUTANDO APIS
### carregando a base de dados: 
```javascript
    curl --location 'http://localhost:3001/api1/marcas/load'
```

### recuperar marcas
```javascript
    curl --location 'http://localhost:3001/api1/marcas'
```

### recuperar modelo a partir de uma marca
```javascript
    curl --location 'http://localhost:3001/api1/veiculos/1'
```

### atualizar modelo a partir de um código
```javascript
    curl --location --request PATCH 'http://localhost:3002/api2/veiculos/1' \
    --header 'Content-Type: application/json' \
    --data '{
            "nome": "Integra GS 1.8",
            "observacoes": "testes"
        }'
```

## Iniciando Front Vue.js

```javascript
  cd front
  npm install
  npm run format
  npm run dev
```