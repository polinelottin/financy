# Financy

Aplicação full stack para organizar finanças pessoais, com gestão de transações e categorias. Desafio da Pós-Graduação Full Stack da Rocketseat.

## Estrutura

- [`backend/`](backend/README.md): API GraphQL com TypeScript, Apollo Server, type-graphql, Prisma e SQLite
- [`frontend/`](frontend/README.md): aplicação React com TypeScript, Vite, Apollo Client, Tailwind e shadcn/ui

## Requisitos

- Node 26. A versão está no `mise.toml`; com o [mise](https://mise.jdx.dev), rode `mise trust && mise install` na raiz.

## Como rodar

Em um terminal, suba a API:

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Preencha `JWT_SECRET` no `backend/.env` com qualquer texto secreto.

Em outro terminal, suba o front-end:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Acesse `http://localhost:5173` e entre com a conta de exemplo criada pelo seed: `conta@teste.com` / `12345678`. Também é possível criar uma conta nova pela tela de cadastro.

## Funcionalidades

- Cadastro, login e edição do nome no perfil
- Cada usuário vê e gerencia apenas as próprias transações e categorias
- Transações: criar, editar, excluir e listar com busca, filtros por tipo, categoria e mês, e paginação
- Categorias: criar, editar, excluir (bloqueado se houver transações) e listar com quantidade e total de transações
- Dashboard com saldo total, receitas e despesas do mês, transações recentes e categorias mais usadas

## Testes

```bash
cd backend && npm test
cd frontend && npm test
```

As regras de negócio da API (autenticação, isolamento por usuário, transações, categorias e resumo) são cobertas por testes num banco SQLite separado.
