# Financy · Backend

API GraphQL do Financy, feita com TypeScript, Apollo Server, type-graphql, Prisma e SQLite.

## Requisitos

- Node 26 (a versão está fixada no `mise.toml` da raiz)

## Como rodar

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

Preencha `JWT_SECRET` no `.env` antes de subir o servidor. O `.env` precisa existir antes do `npm install`, porque a instalação gera o client do Prisma e ele lê o `DATABASE_URL`.

A API fica disponível em `http://localhost:4000/graphql`.

## Scripts

- `npm run dev`: servidor em modo de desenvolvimento, reiniciando a cada alteração
- `npm run build`: compila para `dist/`
- `npm start`: roda a versão compilada
