# Financy · Frontend

Aplicação React do Financy, feita com TypeScript, Vite, Apollo Client, Tailwind e shadcn/ui.

## Requisitos

- Node 26 (a versão está fixada no `mise.toml` da raiz)
- Backend rodando (veja `../backend/README.md`)

## Como rodar

```bash
cp .env.example .env
npm install
npm run dev
```

A aplicação fica disponível em `http://localhost:5173`.

## Scripts

- `npm run dev`: servidor de desenvolvimento
- `npm run build`: checa os tipos e gera a versão de produção em `dist/`
- `npm run lint`: roda o oxlint
- `npm test`: roda os testes dos helpers de formatação e do resumo de categorias

## Páginas

| Rota | Página |
|---|---|
| `/` | Login (deslogado) ou Dashboard (logado) |
| `/cadastro` | Criar conta |
| `/transacoes` | Listagem com filtros, paginação e modal de criar e editar |
| `/categorias` | Grid de categorias com resumo e modal de criar e editar |
| `/perfil` | Editar nome e sair da conta |
