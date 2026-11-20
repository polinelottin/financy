# Financy · Backend

API GraphQL do Financy, feita com TypeScript, Apollo Server, type-graphql, Prisma e SQLite.

## Requisitos

- Node 26 (a versão está fixada no `mise.toml` da raiz)

## Como rodar

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Preencha `JWT_SECRET` no `.env` antes de subir o servidor. O `.env` precisa existir antes do `npm install`, porque a instalação gera o client do Prisma e ele lê o `DATABASE_URL`.

A API fica disponível em `http://localhost:4000/graphql`. Abrindo esse endereço no navegador, o Apollo Sandbox permite testar as operações.

O seed cria uma conta com os dados do layout: `conta@teste.com` / `12345678`. Rodar o seed de novo recria essa conta do zero.

## Scripts

- `npm run dev`: servidor em modo de desenvolvimento, reiniciando a cada alteração
- `npm run build`: compila para `dist/`
- `npm start`: roda a versão compilada
- `npm test`: roda os testes (usam um banco separado, `test.db`)

## Autenticação

Crie a conta com a mutation `register` ou entre com `login`. As duas retornam um `token`, que deve ser enviado nas demais operações no header `Authorization: Bearer <token>`.

## Recuperação de senha

O projeto não envia e-mails. Ao pedir a recuperação pela tela "Recuperar senha", a API imprime o link de redefinição no terminal onde está rodando, por exemplo:

```
Link de redefinição de senha para conta@teste.com: http://localhost:5173/redefinir-senha?token=...
```

O link usa o `FRONTEND_URL` do `.env`, vale por 1 hora e só pode ser usado uma vez.

## Operações

Valores monetários trafegam em centavos (`8950` = R$ 89,50). Cada usuário só vê e altera os próprios dados.

| Operação | Tipo | Descrição |
|---|---|---|
| `register`, `login` | mutation | Cria a conta ou entra, retornando token e usuário |
| `me` | query | Usuário logado |
| `updateProfile` | mutation | Altera o nome do usuário |
| `requestPasswordReset`, `resetPassword` | mutation | Gera o link de redefinição e troca a senha com o token |
| `transactions(filters)` | query | Lista paginada (10 por página) com busca, tipo, categoria e mês/ano |
| `createTransaction`, `updateTransaction`, `deleteTransaction` | mutation | Gerencia transações |
| `categories` | query | Categorias com quantidade e soma das transações |
| `createCategory`, `updateCategory`, `deleteCategory` | mutation | Gerencia categorias (não exclui categoria com transações) |
| `summary(month, year)` | query | Saldo total e receitas e despesas do mês |
