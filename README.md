# RockFinder

Aplicativo mobile para buscar e adicionar eventos de rock. Desenvolvido com Expo e React Native, permite que usuários pesquisem, visualizem eventos de forma fácil e intuitiva.

## Descrição do Projeto

RockFinder é uma aplicação multiplataforma (iOS, Android e Web) que funciona como um buscador de eventos de rock. Os usuários podem visualizar eventos aprovados, pesquisar por nome ou banda e adicionar novos eventos para aprovação. Os dados são sincronizados com um servidor backend que gerencia a aprovação de eventos.

## Requisitos

### Para o Aplicativo Mobile

- Node.js
- npm ou yarn

### Para o Servidor Backend

- Alpine Linux (ou qualquer distribuição Linux)
- Node.js
- npm
- SQLite3

## Instalação e Execução

### 1. Clonar o Repositório

```bash
git clone https://github.com/ThiagoRP00/rockfinder-sqlite.git
cd rockfinder-sqlite
```

### 2. Instalar Dependências do Aplicativo

```bash
npm install
```

### 3. Configurar a URL da API

Edite os arquivos `app/(tabs)/index.js`, `app/(tabs)/addEvent.js` e `app/event/[id].js` e atualize a variável `API_URL` com o endereço do seu servidor:

```javascript
const API_URL = 'http://seu-servidor-api:3000';
```

### 4. Executar o Aplicativo

Para iniciar o servidor de desenvolvimento Expo:

```bash
npx expo start
```

## Configuração do Servidor Backend

### Instalação no Alpine Linux

1. **Conectar ao servidor Alpine Linux**

```bash
ssh usuario@seu-servidor-alpine
```

2. **Atualizar pacotes e instalar dependências**

```bash
apk update
apk add nodejs npm sqlite
```

3. **Criar diretório do projeto**

```bash
mkdir rockfinder-api
cd rockfinder-api
```

4. **Inicializar projeto Node.js**

```bash
npm init -y
```

5. **Instalar dependências necessárias**

```bash
npm install express sqlite3
```

6. **Criar arquivo do servidor**

Crie um arquivo chamado `server.js` com o seguinte código:

```javascript
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(express.json());

const db = new sqlite3.Database('./eventos.db');

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS eventos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      bandas TEXT NOT NULL,
      data TEXT NOT NULL,
      horario TEXT,
      cidade TEXT NOT NULL,
      local TEXT NOT NULL,
      descricao TEXT,
      status TEXT DEFAULT 'pendente'
    )
  `);

});

app.get('/eventos', (req, res) => {
  db.all("SELECT * FROM eventos WHERE status = 'aprovado'", [], (err, rows) => {

    if (err) {
      return res.status(500).json({
        erro: err.message
      });
    }

    res.json(rows);

  });
});

app.get('/eventos/:id', (req, res) => {

  const { id } = req.params;

  db.get(
    'SELECT * FROM eventos WHERE id = ?',
    [id],
    (err, row) => {

      if (err) {
        return res.status(500).json({
          erro: err.message
        });
      }

      res.json(row);

    }
  );

});

app.post('/eventos', (req, res) => {

  const {
    nome,
    bandas,
    data,
    horario,
    cidade,
    local,
    descricao
  } = req.body;

  db.run(
    `
    INSERT INTO eventos
    (nome, bandas, data, horario, cidade, local, descricao)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      nome,
      bandas,
      data,
      horario,
      cidade,
      local,
      descricao
    ],
    function(err) {

      if (err) {
        return res.status(500).json({
          erro: err.message
        });
      }

      res.status(201).json({
        id: this.lastID,
        mensagem: 'Evento criado'
      });

    }
  );

});

app.listen(3000, () => {
  console.log('Servidor iniciado');
});
```

7. **Iniciar o servidor**

```bash
node server.js
```

O servidor estará rodando em `http://seu-servidor-alpine:3000`

### Endpoints da API

- **GET /eventos** - Retorna lista de todos os eventos aprovados
- **GET /eventos/:id** - Retorna detalhes de um evento específico
- **POST /eventos** - Cria um novo evento (status padrão: 'pendente')

## Aprovação de Eventos

Eventos criados via POST terão status 'pendente'. Para aprovar um evento, execute a seguinte consulta SQL no banco de dados:

```sql
UPDATE eventos SET status = 'aprovado' WHERE id = [ID_DO_EVENTO];
```
