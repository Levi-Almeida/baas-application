# BranchFlow — BaaS Platform

Aplicação full stack de **Banking as a Service (BaaS)** desenvolvida como desafio técnico para integração com o sandbox **Lera Box**.

O BranchFlow funciona como uma camada intermediária entre o lojista e o gateway financeiro, centralizando autenticação, carteira, pagamentos via Pix e cartão, consulta de transações, taxas, saques e processamento de webhooks.

O projeto é estruturado como um monorepo contendo uma API em NestJS, frontend em React/Vite e banco MySQL próprio.

> **Ambiente de demonstração:** não utilize documentos, cartões, senhas ou dados financeiros reais.

---

## ✨ Funcionalidades

### Autenticação

- Cadastro de usuário integrado ao Lera Box;
- Login utilizando documento e senha;
- JWT próprio da aplicação;
- Rotas protegidas com Passport e JWT Guard;
- Token do gateway armazenado exclusivamente no backend;
- Credenciais do Lera Box nunca são expostas ao frontend.

### Carteira

- Consulta de saldo disponível;
- Extrato de movimentações;
- Filtros por tipo e status;
- Dashboard financeiro;
- Visualização das últimas transações.

### Pagamentos Pix

- Criação de cobrança Pix;
- Valores tratados em centavos;
- `externalReference` gerado pelo backend;
- QR Code retornado pelo gateway;
- Código Pix Copia e Cola;
- Persistência local do checkout;
- Atualização de status por webhook.

### Pagamentos com cartão

- Processamento de pagamentos com cartão;
- Suporte às bandeiras:
  - Visa
  - Mastercard
  - Elo
- Consulta automática das taxas do gateway;
- Parcelamento de acordo com as taxas disponíveis;
- `feePercent` definido exclusivamente pelo backend;
- Persistência do resultado da operação;
- Nenhum PAN, CVV ou validade é armazenado no banco local.

### Saques

- Solicitação de saque via Pix;
- Persistência local;
- Consulta individual da operação;
- Atualização assíncrona de status por webhook.

### Webhooks

Eventos utilizados:

- `PAYMENT_PIX`
- `PAYMENT_CARD`
- `WITHDRAWAL`

A integração inclui:

- cadastro automático dos endpoints no gateway;
- validação de assinatura HMAC-SHA256;
- uso do corpo bruto da requisição para validação da assinatura;
- controle de idempotência;
- persistência dos eventos recebidos;
- conciliação utilizando `externalReference`;
- atualização do estado local da operação.

---

## 🧱 Arquitetura

```text
                     ┌─────────────────────┐
                     │                     │
                     │    React + Vite     │
                     │      Frontend       │
                     │                     │
                     └──────────┬──────────┘
                                │
                                │ BaaS JWT
                                │
                                ▼
                     ┌─────────────────────┐
                     │                     │
                     │      NestJS         │
                     │      Backend        │
                     │                     │
                     └──────┬────────┬─────┘
                            │        │
                   TypeORM  │        │ HTTPS
                            │        │ Gateway Token
                            ▼        ▼
                  ┌─────────────┐  ┌─────────────────┐
                  │             │  │                 │
                  │    MySQL    │  │  Lera Box API   │
                  │             │  │     Sandbox     │
                  └─────────────┘  └────────┬────────┘
                                           │
                                           │ Webhooks
                                           │ HMAC-SHA256
                                           ▼
                                  ┌─────────────────┐
                                  │                 │
                                  │  NestJS API     │
                                  │ Webhook Handler │
                                  │                 │
                                  └─────────────────┘
```

### Separação de responsabilidades

O frontend nunca acessa diretamente o Lera Box.

```text
React
  ↓
BaaS JWT
  ↓
NestJS
  ↓
Gateway Access Token
  ↓
Lera Box
```

O token recebido do Lera Box permanece armazenado apenas no backend.

---

## 📁 Estrutura do projeto

```text
baas-application/
│
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   └── migrations/
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── checkout/
│   │   │   ├── fees/
│   │   │   ├── gateway/
│   │   │   ├── gateway-accounts/
│   │   │   ├── health/
│   │   │   ├── users/
│   │   │   ├── wallet/
│   │   │   ├── webhooks/
│   │   │   └── withdrawals/
│   │   │
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Tecnologias

### Backend

- TypeScript
- NestJS
- TypeORM
- MySQL
- Axios
- Passport
- JWT
- Swagger / OpenAPI
- class-validator
- class-transformer
- Node.js Crypto
- Migrations TypeORM

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router DOM
- Lucide React
- CSS responsivo

### Infraestrutura

- Render
- MySQL
- Git
- GitHub

---

## 💰 Valores monetários

Todos os valores enviados entre as APIs são tratados como **inteiros em centavos**.

Exemplo:

```text
R$ 1,00    = 100
R$ 100,00  = 10000
R$ 150,00  = 15000
```

Essa abordagem evita problemas de precisão com números de ponto flutuante em operações financeiras.

---

## 🔐 Autenticação

O BranchFlow utiliza dois níveis de autenticação.

### 1. Lera Box

Durante o login, o backend autentica o usuário no gateway utilizando:

```text
document
password
```

O Lera Box retorna seu próprio `access_token`.

Esse token é armazenado no backend e utilizado somente nas comunicações:

```text
NestJS → Lera Box
```

### 2. BranchFlow

Após autenticar no gateway, a aplicação gera um JWT próprio:

```text
NestJS → React
```

O frontend utiliza esse token nas chamadas protegidas:

```http
Authorization: Bearer <BAAS_JWT>
```

Dessa forma, o token do gateway nunca é enviado ao navegador.

---

## 🔄 Fluxo de login

```text
Usuário
   ↓
React
   ↓
POST /api/auth/login
   ↓
NestJS
   ↓
Lera Box /auth/login
   ↓
Gateway Access Token
   ↓
Persistência segura no backend
   ↓
Geração do BaaS JWT
   ↓
React
```

---

## 🗄️ Banco de dados

O projeto utiliza banco **MySQL próprio**.

O banco do Lera Box nunca é acessado diretamente.

Entre os principais dados persistidos estão:

- usuários;
- contas vinculadas ao gateway;
- checkouts;
- status de pagamentos;
- taxas utilizadas;
- solicitações de saque;
- eventos de webhook;
- referências externas para conciliação.

A estrutura é controlada através de **migrations TypeORM**.

---

# ⚙️ Configuração de ambiente

## Backend

Crie:

```text
backend/.env
```

utilizando:

```text
backend/.env.example
```

como referência.

Exemplo:

```dotenv
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=baas_user
DB_PASSWORD=your_password
DB_DATABASE=baas_db

GATEWAY_BASE_URL=https://api.branchpay.com.br/api

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=8h

WEBHOOK_SECRET=your_webhook_secret

PUBLIC_API_URL=http://localhost:3000
```

### Variáveis

| Variável | Descrição |
|---|---|
| `PORT` | Porta utilizada pela API |
| `DB_HOST` | Host do MySQL |
| `DB_PORT` | Porta do MySQL |
| `DB_USERNAME` | Usuário do banco |
| `DB_PASSWORD` | Senha do banco |
| `DB_DATABASE` | Nome do banco |
| `GATEWAY_BASE_URL` | URL da API Lera Box |
| `JWT_SECRET` | Segredo utilizado no JWT da aplicação |
| `JWT_EXPIRES_IN` | Tempo de expiração do JWT |
| `WEBHOOK_SECRET` | Segredo compartilhado para validação HMAC |
| `PUBLIC_API_URL` | URL pública utilizada no cadastro dos webhooks |

> Nunca versione o arquivo `.env`.

---

## Frontend

Crie:

```text
frontend/.env
```

Exemplo local:

```dotenv
VITE_API_URL=http://localhost:3000/api
```

Para utilizar a API publicada:

```dotenv
VITE_API_URL=https://baas-application-api.onrender.com/api
```

---

# ▶️ Execução local

## Pré-requisitos

Tenha instalado:

- Node.js;
- npm;
- MySQL;
- Git.

---

## 1. Clone o projeto

```bash
git clone https://github.com/Levi-Almeida/baas-application.git
```

Entre na pasta:

```bash
cd baas-application
```

---

## 2. Configure o banco

Crie um banco MySQL:

```sql
CREATE DATABASE baas_db;
```

Configure as credenciais no:

```text
backend/.env
```

---

## 3. Backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Execute as migrations:

```bash
npm run migration:run -- -d src/database/data-source.ts
```

Inicie em desenvolvimento:

```bash
npm run start:dev
```

A API estará disponível em:

```text
http://localhost:3000
```

---

## 4. Frontend

Em outro terminal:

```bash
cd frontend
```

Instale:

```bash
npm install
```

Inicie:

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:5173
```

---

# 📚 Swagger

A documentação da API é disponibilizada através do Swagger.

### Local

```text
http://localhost:3000/docs
```

### Produção

```text
https://baas-application-api.onrender.com/docs
```

---

# 🌐 Ambiente publicado

## Backend

```text
https://baas-application-api.onrender.com
```

## Swagger

```text
https://baas-application-api.onrender.com/docs
```

## Healthcheck

```text
https://baas-application-api.onrender.com/api/health
```

## Frontend

```text
ADICIONAR_URL_DO_FRONTEND_APÓS_DEPLOY
```

> O ambiente utiliza serviços gratuitos e pode apresentar **cold start** após períodos de inatividade.

---

# 🔌 Principais endpoints

## Autenticação

### Cadastro

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

---

## Carteira

### Saldo

```http
GET /api/wallet
```

### Extrato

```http
GET /api/wallet/transactions
```

Filtros disponíveis incluem:

```text
status
type
limit
```

---

## Taxas

```http
GET /api/fees
```

Exemplo:

```http
GET /api/fees?brand=VISA
```

---

## Pix

```http
POST /api/checkouts/pix
```

Exemplo:

```json
{
  "amount": 15000,
  "description": "Pagamento pedido #123",
  "payerDocument": "00000000000"
}
```

A referência externa é criada pelo próprio backend.

Exemplo de resposta:

```json
{
  "checkoutId": "uuid",
  "externalReference": "CHECKOUT-uuid",
  "status": "APPROVED",
  "qrCodeBase64": "data:image/png;base64,...",
  "emv": "...",
  "txid": "..."
}
```

---

## Cartão

```http
POST /api/checkouts/card
```

Exemplo de sandbox:

```json
{
  "amount": 10000,
  "description": "Compra online",
  "brand": "VISA",
  "cardNumber": "4111111111111111",
  "cardHolder": "MARIA SILVA",
  "expiryMonth": "12",
  "expiryYear": "2030",
  "cvv": "123",
  "installments": 1
}
```

Antes de chamar o gateway, o backend consulta:

```http
GET /api/fees?brand=VISA
```

e seleciona a taxa correspondente ao número de parcelas.

O frontend **não define o `feePercent`**.

---

## Saques

### Criar

```http
POST /api/withdrawals
```

Exemplo:

```json
{
  "amount": 10000,
  "pixKey": "chave-pix-sandbox",
  "description": "Saque para conta pessoal",
  "document": "00000000000"
}
```

### Consultar

```http
GET /api/withdrawals/:id
```

---

# 🪝 Webhooks

O BranchFlow registra três eventos no Lera Box:

```text
PAYMENT_PIX
PAYMENT_CARD
WITHDRAWAL
```

## Configuração

```http
POST /api/webhooks/configure
```

O backend cadastra automaticamente URLs semelhantes a:

```text
/api/webhooks/lera-box/pix
/api/webhooks/lera-box/card
/api/webhooks/lera-box/withdrawal
```

---

## Fluxo de webhook

```text
Lera Box
   ↓
Webhook HTTPS
   ↓
NestJS
   ↓
Validação HMAC-SHA256
   ↓
Verificação de idempotência
   ↓
Persistência do evento
   ↓
Conciliação via externalReference
   ↓
Atualização do checkout ou saque
```

---

## Validação HMAC

Quando um webhook é configurado com `WEBHOOK_SECRET`, o Lera Box envia:

```http
X-Lera-Box-Signature
```

A aplicação calcula:

```text
HMAC-SHA256(rawBody, WEBHOOK_SECRET)
```

e compara a assinatura antes de processar a operação.

O corpo bruto da requisição é utilizado para evitar divergências provocadas pela serialização do JSON.

---

## Idempotência

Os callbacks podem ser reenviados pelo gateway.

Por isso, o `transactionId` é utilizado para detectar eventos já processados.

```text
Webhook recebido
      ↓
transactionId já existe?
      │
  ┌───┴────┐
 SIM      NÃO
  │         │
ignora   processa
```

Isso evita que uma mesma movimentação seja conciliada mais de uma vez.

---

# 💳 Segurança dos dados de cartão

Os dados do cartão são utilizados somente para realizar a chamada ao sandbox.

A aplicação **não persiste**:

- número completo do cartão;
- CVV;
- mês de validade;
- ano de validade.

O frontend envia os dados ao backend, que imediatamente os encaminha ao gateway.

> Este projeto é uma demonstração conectada a um sandbox e não possui certificação PCI DSS. Dados financeiros reais nunca devem ser utilizados.

---

# 🔗 Conciliação

Cada checkout e saque recebe uma referência própria:

```text
CHECKOUT-<uuid>
```

ou:

```text
WITHDRAWAL-<uuid>
```

Essa referência é enviada ao gateway como:

```text
externalReference
```

Quando o webhook retorna, o backend utiliza a mesma referência para localizar a operação correspondente no banco local.

```text
Pagamento
   ↓
externalReference
   ↓
Lera Box
   ↓
Webhook
   ↓
externalReference
   ↓
Registro local
```

---

# 🎲 Comportamento do sandbox

O Lera Box utilizado neste projeto é um ambiente simulado.

Operações financeiras podem retornar aleatoriamente:

```text
APPROVED
```

ou:

```text
DENIED
```

Portanto, um resultado `DENIED` não significa necessariamente erro na integração.

Por exemplo:

```text
HTTP 200
↓
Gateway processou a operação
↓
status = DENIED
```

representa uma transação corretamente processada, porém negada pelo simulador.

---

# 🖥️ Frontend

O frontend foi construído como um painel financeiro responsivo.

Principais páginas:

```text
/login
/register
/dashboard
/payments
/transactions
/withdrawals
/webhooks
```

---

## Dashboard

Apresenta:

- saldo disponível;
- últimas movimentações;
- entradas recentes;
- saídas recentes;
- status das operações;
- atalhos para Pix;
- cartão;
- saque.

---

## Pagamentos

A página possui duas modalidades:

### Pix

Permite:

- informar valor;
- descrição;
- documento;
- gerar QR Code;
- visualizar status;
- copiar o código Pix.

### Cartão

Permite:

- selecionar bandeira;
- consultar taxas;
- selecionar parcelas;
- processar o pagamento;
- visualizar status final.

---

## Transações

Permite visualizar o extrato da carteira e utilizar filtros por:

- status;
- tipo da operação.

Os resultados são apresentados em formato de tabela.

---

## Saques

Permite solicitar um saque informando:

- valor;
- chave Pix;
- documento;
- descrição.

---

## Webhooks

Permite realizar a configuração dos eventos e visualizar:

- tipo do evento;
- endpoint;
- status;
- uso de HMAC.

---

# 🧪 Fluxo sugerido para demonstração

Para avaliar o projeto de ponta a ponta:

### 1. Crie uma conta

Acesse:

```text
/register
```

Preencha os dados fictícios.

O gateway enviará as credenciais para o e-mail informado.

---

### 2. Faça login

Acesse:

```text
/login
```

Informe:

```text
documento
senha recebida pelo gateway
```

---

### 3. Consulte o Dashboard

Confira:

- saldo;
- entradas;
- saídas;
- últimas transações.

---

### 4. Gere um Pix

Acesse:

```text
Pagamentos → Pix
```

Informe valor, descrição e documento fictício.

Confira:

- QR Code;
- Pix Copia e Cola;
- status;
- `externalReference`.

---

### 5. Faça um pagamento com cartão

Acesse:

```text
Pagamentos → Cartão
```

Exemplo de cartão utilizado no sandbox:

```text
Número: 4111111111111111
Bandeira: VISA
Nome: MARIA SILVA
Validade: 12/2030
CVV: 123
```

Escolha a quantidade de parcelas disponível.

O resultado poderá ser:

```text
APPROVED
```

ou:

```text
DENIED
```

de acordo com a simulação do sandbox.

---

### 6. Consulte transações

Acesse:

```text
Transações
```

Teste os filtros disponíveis.

---

### 7. Solicite um saque

Acesse:

```text
Saques
```

Informe uma chave e documento fictícios.

---

### 8. Configure webhooks

Acesse:

```text
Webhooks
```

ou utilize:

```http
POST /api/webhooks/configure
```

Os eventos serão cadastrados no gateway utilizando a URL pública configurada em:

```dotenv
PUBLIC_API_URL
```

---

# ✅ Verificação do projeto

Antes de executar ou entregar, os builds podem ser validados separadamente.

## Backend

```bash
cd backend
npm install
npm run build
```

## Frontend

```bash
cd frontend
npm install
npm run build
```

---

# 🩺 Healthcheck

A API disponibiliza uma rota para verificar se a aplicação está online:

```http
GET /api/health
```

Produção:

```text
https://baas-application-api.onrender.com/api/health
```

---

# 🔒 Segurança

Algumas decisões adotadas no projeto:

- JWT próprio para autenticação do frontend;
- token do gateway restrito ao backend;
- variáveis sensíveis armazenadas em `.env`;
- `.env` ignorado pelo Git;
- HMAC-SHA256 nos callbacks;
- comparação segura da assinatura;
- idempotência de webhooks;
- `externalReference` gerado no backend;
- taxa do cartão calculada no backend;
- CVV e PAN não persistidos;
- validação dos DTOs;
- CORS configurado;
- rotas financeiras protegidas.

---

# ⚠️ Observações

Este projeto foi desenvolvido exclusivamente para fins de avaliação técnica e utiliza um **sandbox financeiro**.

Não utilize:

- cartões reais;
- documentos reais;
- contas bancárias reais;
- senhas reais;
- chaves Pix reais;
- informações financeiras reais.

---

# 🛠️ Solução de problemas

### Backend não conecta ao banco

Confira:

```dotenv
DB_HOST
DB_PORT
DB_USERNAME
DB_PASSWORD
DB_DATABASE
```

e verifique se as migrations foram executadas:

```bash
npm run migration:run -- -d src/database/data-source.ts
```

---

### Frontend recebe erro de CORS

Verifique se o backend permite a origem onde o frontend está executando.

Em desenvolvimento:

```text
http://localhost:5173
```

---

### Frontend chama a API errada

Confira:

```dotenv
VITE_API_URL
```

Após alterar `.env`, reinicie o Vite:

```bash
npm run dev
```

Em produção, lembre-se que variáveis `VITE_*` são incorporadas durante o build.

---

### `DENIED` em pagamento

`DENIED` é um status financeiro retornado pelo sandbox e não necessariamente um erro da aplicação.

```text
200 OK + DENIED
```

significa que a chamada foi processada corretamente e a transação foi negada pelo simulador.

---

### API no Render demora para responder

O projeto utiliza infraestrutura de demonstração e pode sofrer **cold start** após períodos de inatividade.

Acesse primeiro:

```text
https://baas-application-api.onrender.com/api/health
```

e aguarde a inicialização do serviço.

---

# 📌 Considerações finais

O objetivo do BranchFlow é demonstrar uma integração BaaS completa mantendo uma separação clara entre:

```text
Interface
↓
Regra de negócio
↓
Persistência
↓
Gateway financeiro
```

A aplicação não atua apenas como proxy do Lera Box.

Ela possui sua própria camada de:

- autenticação;
- persistência;
- geração de referências;
- controle de acesso;
- validação;
- consulta de taxas;
- conciliação;
- idempotência;
- processamento de webhooks;
- interface financeira.

Isso permite que o frontend opere exclusivamente sobre a API BaaS enquanto toda a integração sensível com o gateway permanece isolada no backend.

---

## 👨‍💻 Autor

**Levi Almeida**

GitHub:

```text
https://github.com/Levi-Almeida
```

Projeto desenvolvido como desafio técnico de desenvolvimento Full Stack.