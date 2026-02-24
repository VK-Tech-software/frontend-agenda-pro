# Frontend Agenda Pro

Aplicação web em React + Vite para consumo da API Agenda Pro.

## Requisitos

- Node.js 18+
- pnpm 10+

## Configuração

1. Instale dependências:
   - `pnpm install`
2. Crie o arquivo de ambiente:
   - copie `.env.example` para `.env`
3. Use as variáveis padrão de desenvolvimento:
   - `VITE_MS_API=/api`
   - `VITE_API_TARGET=http://127.0.0.1:8080`

Essa configuração usa proxy do Vite para manter autenticação por cookie sem problemas de CORS no navegador.

## Executar

- `pnpm dev`
- App local: `http://localhost:5173`

## Build e lint

- `pnpm lint`
- `pnpm build`

## CI

O workflow `frontend-ci.yml` executa lint e build em push/pull request.
