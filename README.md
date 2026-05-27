# 🐦 Twitter da Madeira - Projeto Final de Front-End

> **Projeto Académico de Avaliação:** Um clone responsivo e interativo do Twitter/X, composto por uma aplicação cliente em **React (Vite + TypeScript)** e uma API RESTful em **Node.js (Express + Sequelize + MySQL)**.

---

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como trabalho prático de avaliação universitária para a disciplina de Front-End. O objetivo é demonstrar a integração de uma interface rica, dinâmica e reativa com uma API de backend persistente, incorporando práticas modernas de desenvolvimento web, controlo de acessos e backoffice de administração.

---

## 🛠️ Stack Tecnológica

### Frontend (Cliente)
- **Framework:** React 19 (Vite)
- **Linguagem:** TypeScript
- **Estilização:** Bootstrap 5 & CSS Personalizado (Custom Themes)
- **Gráficos:** Recharts (para visualização de métricas de administração)
- **Rotas:** React Router DOM (v7)
- **Comunicação:** Axios

### Backend (Servidor)
- **Ambiente:** Node.js & Express
- **ORM:** Sequelize
- **Base de Dados:** MySQL
- **Autenticação:** JSON Web Token (JWT) & BcryptJS (encriptação de palavras-passe)
- **Upload de Ficheiros:** Multer (processamento de imagens anexadas aos tweets)
- **Documentação:** Swagger (Swagger UI Express + Swagger Autogen)

---

## 🚀 Funcionalidades Principais

### 1. Autenticação e Segurança
- Registo de novos utilizadores com validação de dados.
- Login seguro com geração de tokens JWT armazenados localmente (`localStorage`).
- Rotas protegidas no frontend através de um componente guardião (`ProtectedRoute.tsx`).
- Encriptação de palavras-passe no servidor através de `bcryptjs`.

### 2. Feed e Interatividade
- **Publicação de Tweets:** Permite escrever mensagens (limite de 280 caracteres) com suporte opcional para upload de imagens.
- **Feed Geral:** Exibição de todas as publicações da plataforma por ordem cronológica inversa.
- **Feed Personalizado ("Estou a seguir"):** Filtro dinâmico que exibe apenas as publicações de utilizadores que o utilizador autenticado segue.
- **Likes:** Sistema de curtidas com atualizações otimistas no frontend para uma experiência fluida.
- **Comentários:** Visualização e inserção de comentários específicos para cada tweet.
- **Seguir Utilizadores:** Possibilidade de seguir e deixar de seguir outros utilizadores diretamente do feed.

### 3. Gestão de Temas
- Suporte a temas Claro (**Light**) e Escuro (**Dark**) gerenciados globalmente via `ThemeContext` no React, com persistência visual instantânea.

### 4. Backoffice de Administração (Dashboard)
Painel exclusivo para administradores (proteção de rota com nível de acesso `requireAdmin={true}`), permitindo:
- **Gestão de Utilizadores:**
  - Listagem completa de utilizadores registados.
  - Edição de informações (Username, Email e Função/Role: `user` ou `admin`).
  - Eliminação permanente de contas.
- **Gestão de Tweets:**
  - Listagem e auditoria de todos os tweets publicados.
  - Edição de conteúdo de tweets.
  - Remoção de imagens anexadas.
  - Eliminação permanente de publicações inadequadas.

---

## 🏗️ Estrutura de Pastas do Repositório

O projeto está estruturado em duas partes principais dentro da pasta do projeto:

```text
Front_End_Final_Projeto-main/
├── server/                    # Servidor Backend Express
│   ├── config/                # Ficheiros de configuração (Base de dados Sequelize)
│   ├── controllers/           # Lógica de negócio das rotas da API
│   ├── middleware/            # Middlewares de autenticação e validação
│   ├── models/                # Modelos de dados do Sequelize (User, Tweet, Comment, Follow, Like)
│   ├── routes/                # Definição das rotas REST
│   ├── uploads/               # Imagens enviadas pelos utilizadores (estático)
│   ├── app.js                 # Ponto de entrada do servidor
│   ├── swagger.json           # Definição auto-gerada da API
│   └── package.json           # Dependências e scripts do servidor
│
├── src/                       # Aplicação Frontend React
│   ├── components/            # Componentes reutilizáveis e páginas
│   │   ├── AdminTweets.tsx    # Gestão de tweets no Backoffice
│   │   ├── AdminUsers.tsx     # Gestão de utilizadores no Backoffice
│   │   ├── Feed.tsx           # Componente de feed (Geral e Seguidores)
│   │   ├── LeftMenu.tsx       # Menu lateral de navegação e controlo de tema/logout
│   │   ├── Login.tsx          # Página de login
│   │   ├── Register.tsx       # Página de registo
│   │   ├── Tweet.tsx          # Componente individual de tweet (ações de like, follow, comentários)
│   │   └── ProtectedRoute.tsx # Protetor de rotas por autenticação e perfil admin
│   ├── config/                # Configurações do frontend (ex: Firebase)
│   ├── db/                    # Dados locais de fallback em formato JSON
│   ├── services/              # Integração de API com Axios (api.ts)
│   ├── styles/                # Ficheiros CSS personalizados e variáveis de tema
│   ├── App.tsx                # Componente principal e gestor de rotas
│   └── main.tsx               # Ponto de entrada do React
│
├── index.html                 # Ficheiro HTML principal (Vite)
├── package.json               # Dependências e scripts do frontend
└── vite.config.ts             # Configuração do Vite
```

---

## 🔧 Configuração e Instalação

### Pré-requisitos
- **Node.js** (v16.x ou superior recomendado)
- **npm** (instalado com o Node.js)
- **MySQL** (opcional - por defeito o projeto aponta para um servidor MySQL remoto para facilitar a avaliação)

---

### Passo 1: Configuração do Backend (Servidor)

1. Aceda à pasta do servidor:
   ```bash
   cd Front_End_Final_Projeto-main/server
   ```

2. Instale as dependências necessárias:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie ou edite o ficheiro `.env` na raiz da pasta `server/` (exemplo incluído no repositório):
   ```env
   PORT=3000
   DB_HOST=sql7.freesqldatabase.com
   DB_PORT=3306
   DB_USER=sql7827785
   DB_PASSWORD=E2FkMwdl9E
   DB_NAME=sql7827785
   JWT_SECRET=supersecretjwtkey_madeira2026
   ```
   > **Nota:** As configurações padrão acima utilizam uma base de dados MySQL gratuita hospedada online (`freesqldatabase.com`), permitindo que a aplicação funcione imediatamente sem necessidade de configurar um servidor MySQL local. Caso prefira utilizar uma base de dados local, altere os parâmetros em conformidade.

4. Inicie o servidor em modo de desenvolvimento (reinicia automaticamente ao alterar código):
   ```bash
   npm run dev
   ```
   O servidor estará ativo em `http://localhost:3000`.

5. **Documentação da API (Swagger UI):**
   Com o servidor ligado, aceda a [http://localhost:3000/api-docs](http://localhost:3000/api-docs) no seu navegador para testar interativamente todos os endpoints da API.

---

### Passo 2: Configuração do Frontend (Cliente)

1. Aceda à pasta raiz do frontend:
   ```bash
   cd Front_End_Final_Projeto-main
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Configure a ligação à API:
   Crie ou edite o ficheiro `.env` na pasta raiz do frontend (`Front_End_Final_Projeto-main/`):
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```
   A aplicação cliente abrirá no seu navegador no endereço: `http://localhost:5173`.

---

## 🔐 Controlo de Acesso e Utilizadores de Teste

Para testar todas as funcionalidades do projeto, incluindo o painel de administração (Dashboard), pode utilizar as seguintes contas de teste configuradas na base de dados:

### 👑 Administrador
- **E-mail:** `admin@gmail.com`
- **Palavra-passe:** `admin123`
- *Permissões:* Acesso total ao Feed e ao Painel de Administração (Backoffice).

### 👥 Utilizadores Comuns

- **Utilizador 1:**
  - **E-mail:** `joana@gmail.com`
  - **Palavra-passe:** `joana123`

- **Utilizador 2:**
  - **E-mail:** `joao@gmail.com`
  - **Palavra-passe:** `joao123`

> 📝 **Nota:** Se desejar, também poderá registar um novo utilizador diretamente na aplicação através do formulário de registo.

---

## 🔌 Referência de Rotas da API (Endpoints)

Abaixo estão listadas as principais rotas expostas pela API do servidor. A documentação completa com esquemas de payload está disponível na rota `/api-docs`.

### Autenticação (`/auth`)
- `POST /auth/register` - Regista um novo utilizador.
- `POST /auth/login` - Efetua o login e devolve o token JWT.
- `GET /auth/me` - Obtém as informações do utilizador autenticado atual.
- `POST /auth/logout` - Invalida/limpa a sessão de login.

### Tweets (`/tweets`)
- `GET /tweets` - Retorna a lista de todos os tweets (requer autenticação).
- `POST /tweets` - Cria um novo tweet com suporte a texto e anexo de imagem (form-data).
- `POST /tweets/:id/like` - Adiciona ou remove um "Like" no tweet especificado.

### Comentários (`/tweets/:id/comments`)
- `GET /tweets/:id/comments` - Obtém a lista de comentários de um tweet.
- `POST /tweets/:id/comments` - Adiciona um novo comentário a um tweet.

### Utilizadores (`/users`)
- `GET /users` - Lista todos os utilizadores da plataforma.
- `POST /users/:id/follow` - Segue ou deixa de seguir o utilizador especificado.

### Administração (`/admin`)
- `GET /admin/users` - Lista detalhada de todos os utilizadores para auditoria.
- `PUT /admin/users/:id` - Atualiza dados do utilizador (username, email, role).
- `DELETE /admin/users/:id` - Elimina permanentemente a conta de um utilizador.
- `PUT /admin/tweets/:id` - Edita o texto ou remove a imagem de um tweet.
- `DELETE /admin/tweets/:id` - Elimina um tweet permanentemente.

---

## 👥 Autores e Desenvolvedores

Este projeto foi elaborado como parte da avaliação académica na Universidade.

- **Desenvolvedores:**
  - Jlcdias ([@Jlcdias](https://github.com/Jlcdias))
  - Catarina Faria ([@catarinasdfaria](https://github.com/catarinasdfaria))
- **Agradecimentos:** Ao corpo docente da disciplina de Front-End pelo apoio e orientações fornecidas ao longo do desenvolvimento.

---
*Última atualização: Maio de 2026*
