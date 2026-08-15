# BranchFlow — BaaS Platform

Aplicação full stack de **Banking as a Service (BaaS)** integrada ao sandbox **Lera Box**.

O projeto funciona como uma camada intermediária entre o frontend e o gateway financeiro, centralizando autenticação, pagamentos, carteira, transações, saques e webhooks.

## 🚀 Tecnologias

### Backend
- NestJS
- TypeScript
- TypeORM
- MySQL
- JWT / Passport
- Swagger
- Axios
- class-validator

### Frontend
- React
- TypeScript
- Vite
- Axios
- React Router
- Lucide React

## 🧱 Arquitetura

```text
React
  ↓
BaaS JWT
  ↓
NestJS
  ↓
Gateway Token
  ↓
Lera Box API

Lera Box
  ↓
Webhooks
  ↓
NestJS
  ↓
MySQL
```

O frontend nunca acessa diretamente o Lera Box e o token do gateway permanece apenas no backend.

## ✨ Funcionalidades

- Cadastro e login
- JWT próprio da aplicação
- Consulta de saldo
- Extrato com filtros
- Pagamentos Pix
- QR Code e Pix Copia e Cola
- Pagamentos com cartão
- Consulta automática de taxas
- Parcelamento
- Solicitação de saques
- Configuração de webhooks
- Eventos `PAYMENT_PIX`, `PAYMENT_CARD` e `WITHDRAWAL`
- Validação HMAC-SHA256
- Idempotência de webhooks
- Persistência local com MySQL
- Swagger
- Dashboard responsivo

## 💰 Valores monetários

Todos os valores são tratados em centavos.

```text
R$ 100,00 = 10000
R$ 150,00 = 15000
```

## 📁 Estrutura

```text
baas-application/
├── backend/
│   └── src/
│       ├── database/
│       └── modules/
│           ├── auth/
│           ├── checkout/
│           ├── fees/
│           ├── gateway/
│           ├── users/
│           ├── wallet/
│           ├── withdrawals/
│           └── webhooks/
│
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       └── styles/
│
└── README.md
```

## ⚙️ Variáveis de ambiente

### Backend

Crie `backend/.env`:

```env
PORT=3000

DB_HOST=
DB_PORT=3306
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

GATEWAY_BASE_URL=https://api.branchpay.com.br/api

JWT_SECRET=
JWT_EXPIRES_IN=8h

WEBHOOK_SECRET=
PUBLIC_API_URL=
```

### Frontend

Crie `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Para usar a API publicada:

```env
VITE_API_URL=https://baas-application-api.onrender.com/api
```

## ▶️ Executando localmente

### Backend

```bash
cd backend
npm install
npm run migration:run -- -d src/database/data-source.ts
npm run start:dev
```

API:

```text
http://localhost:3000
```

Swagger:

```text
http://localhost:3000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## 🌐 Ambiente publicado

### API

```text
https://baas-application-api.onrender.com
```

### Swagger

```text
https://baas-application-api.onrender.com/docs
```

### Healthcheck

```text
https://baas-application-api.onrender.com/api/health
```

### Frontend

```text
https://baas-application.vercel.app/login
```

## 🔌 Principais endpoints

```http
POST /api/auth/register
POST /api/auth/login

GET  /api/wallet
GET  /api/wallet/transactions

GET  /api/fees

POST /api/checkouts/pix
POST /api/checkouts/card

POST /api/withdrawals
GET  /api/withdrawals/:id

POST /api/webhooks/configure
```

## 🪝 Webhooks

Eventos suportados:

```text
PAYMENT_PIX
PAYMENT_CARD
WITHDRAWAL
```

Fluxo:

```text
Lera Box
  ↓
Webhook
  ↓
Validação HMAC
  ↓
Idempotência
  ↓
Persistência
  ↓
Conciliação por externalReference
  ↓
Atualização da operação
```

## 🔐 Segurança

- Token do gateway não é exposto ao frontend
- JWT próprio da aplicação
- Segredos armazenados em `.env`
- Validação HMAC nos webhooks
- Controle de idempotência
- `externalReference` gerado no backend
- Taxa do cartão definida pelo backend
- PAN e CVV não são persistidos

## 🧪 Sandbox

O gateway utilizado é um ambiente de demonstração.

Pagamentos podem retornar aleatoriamente:

```text
APPROVED
DENIED
```

Um `DENIED` pode representar uma operação processada corretamente pelo sandbox, mas negada pelo simulador.

Não utilize dados financeiros reais.

## 👨‍💻 Autor

**Levi Almeida**

GitHub:

```text
https://github.com/Levi-Almeida
```

Projeto desenvolvido como desafio técnico Full Stack.