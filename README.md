# 🔧 Minha Oficina

Sistema de gestão para oficinas mecânicas: cadastro de clientes e veículos,
abertura de ordens de serviço, controle do fluxo de atendimento e histórico.

**Frontend mobile (React) e backend (Express/Prisma) são projetos separados**,
publicados em URLs diferentes e comunicando-se por API HTTP com autenticação JWT.

---

## 🌐 Acesso em produção

| Aplicação | Link |
|---|---|
| **Aplicativo mobile** | https://minha-oficina-frontend.vercel.app |
| **API (Render)** | https://minha-oficina-api.onrender.com |

**Login de demonstração:** `admin@oficina.com` · senha `123456` (Carlos Costa, o dono da oficina)

> Dica: abra o link do aplicativo no celular ou use o modo responsivo do navegador
> com largura de 390px para ver a interface mobile como foi projetada.
> A API é usada pelo aplicativo; abrir o link dela no navegador mostra apenas
> a mensagem `API Minha Oficina funcionando`. No plano gratuito do Render, o
> serviço pode levar alguns segundos para responder depois de ficar ocioso.

➡️ **[Roteiro completo de teste para o professor](docs/ROTEIRO-DE-TESTES.md)**

---

## ▶️ Executar localmente

Pré-requisitos: Node.js 20.19+ e acesso ao banco PostgreSQL (Neon).

```bash
# 1) Backend — porta 3333
cd backend
npm install
cp .env.example .env   # preencha DATABASE_URL e JWT_SECRET
npm run dev

# 2) Frontend — porta 5173 (em outro terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

No PowerShell, troque `cp` por `Copy-Item`. O `npm install` do backend já roda
`prisma generate` automaticamente.

Por padrão o frontend aponta para `http://localhost:3333`. Para apontar o
frontend local para a API publicada, configure `VITE_API_URL` no `.env`.

Para simular produção no backend:

```bash
cd backend
npm run build
npm start
```

---

## 🚀 Deploy

O repositório está preparado para dois serviços independentes:

| Parte | Plataforma | Configuração |
|---|---|---|
| API | **Render** | Blueprint `render.yaml`, root `backend` |
| Frontend | **Vercel** | Root Directory `frontend`, framework Vite |

Ordem recomendada: **primeiro o backend** (para ter a URL da API), **depois o
frontend** (que precisa dessa URL no build). Os dois se atualizam sozinhos a
cada `git push` na branch `main`.

### Backend no Render

1. No Render, escolha **New → Blueprint** e conecte este repositório.
2. O `render.yaml` cria o serviço `minha-oficina-api` com:
   - build: `npm ci --include=dev && npm run build`
   - start: `npm start`
   - health check: `/health`
3. Preencha os segredos solicitados:
   - `DATABASE_URL` — URL do Neon (use a que contém `-pooler`);
   - `JWT_SECRET` — um segredo forte;
   - `FRONTEND_URL` — URL do frontend na Vercel.
4. Anote a URL gerada, por exemplo `https://minha-oficina-api.onrender.com`.
5. Valide abrindo `https://minha-oficina-api.onrender.com/health` — deve
   responder `{"status":"ok"}`.

> O banco do Neon já está com as migrações aplicadas. Se um dia criar um banco
> novo, rode `npm run db:deploy` (e `npm run db:seed`) a partir de `backend`
> com o `DATABASE_URL` configurado.

### Frontend na Vercel

1. Importe este repositório na Vercel.
2. Configure **Root Directory** = `frontend`.
3. Framework preset: **Vite**.
4. Em **Environment Variables**, defina:
   - `VITE_API_URL=https://minha-oficina-api.onrender.com`
5. Faça o deploy. O `VITE_API_URL` é lido no build; se mudar, redeploye.

> O frontend usa rotas por hash (`#painel`, `#detalhe`), então não precisa de
> rewrite de SPA na Vercel.

---

## ✅ O que testar em 5 minutos

1. Acesse https://minha-oficina-frontend.vercel.app
2. Entre com `admin@oficina.com` / `123456`
3. Confira o **Painel**: resumo de atendimentos por status e ordens recentes
4. Toque em **Clientes → + Novo**, cadastre um cliente
5. Abra o cliente, cadastre um veículo e toque em **+ Nova OS**
6. Na OS, use **Atualizar status** para avançar `Aguardando → Em serviço → Pronto → Finalizado`
7. Em **Menu → Histórico**, veja os serviços finalizados
8. Ainda em **Menu**, teste **Buscas** (CPF/placa), **Na oficina** e **Usuários**

Detalhes e resultados esperados em [docs/ROTEIRO-DE-TESTES.md](docs/ROTEIRO-DE-TESTES.md).

---

## 📱 Navegação e permissões

A barra inferior tem cinco botões — **Painel, Clientes, Nova OS, Ordens e Menu** —
todos com o nome escrito, para que não seja necessário adivinhar o que cada ícone
faz. O botão central abre uma nova ordem de serviço.

Existem três papéis de usuário:

| Papel | O que pode fazer |
|---|---|
| Dono (Carlos) | Tudo, inclusive excluir registros e gerenciar usuários |
| Mecânico | Atualizar os atendimentos que criou, além de consultar os demais dados |
| Recepcionista | Cadastrar clientes e veículos e abrir ordens de serviço |

O card de cada ordem fica colorido conforme o status: amarelo (aguardando), azul
(em serviço), verde (pronto), teal (finalizado) e vermelho (cancelado). Assim dá
para entender a situação de relance, sem precisar ler o texto.

## 📁 Estrutura

```text
minha-oficina/
├── backend/                       # API Express + Prisma + PostgreSQL (Render)
│   ├── prisma/                    # schema, migrations e seed
│   └── src/modules/               # auth, dashboard, clientes, veículos,
│                                  # atendimentos, fluxo, histórico, usuários
├── frontend/                      # aplicativo mobile React + Vite (Vercel)
│   ├── src/components/telas/      # telas do aplicativo
│   ├── src/services/endpoints.ts  # todas as rotas da API
│   ├── src/context/AuthContext.tsx
│   ├── design-system/             # identidade visual
│   └── README.md                  # documentação do frontend
├── docs/                          # documentação, roteiro de testes e imagens
├── render.yaml                    # Blueprint do backend no Render
├── Insomnia_Minha_Oficina.json    # coleção de testes da API
├── .gitignore
└── README.md                      # este arquivo
```

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Vite, CSS
- **Backend**: Node.js, Express 5, TypeScript, Prisma 7, PostgreSQL (Neon)
- **Deploy**: Render (API) e Vercel (frontend)

## 📚 Documentação

- [Visão geral do projeto](docs/readme.md)
- [Roteiro de testes](docs/ROTEIRO-DE-TESTES.md)
- [Auditoria UI/UX](docs/AUDITORIA-UI-UX.md)
- [Teste com mecânico de 48 anos](docs/TESTE-USUARIO-48ANOS.md)
- [O que mudou e por quê](docs/O-QUE-MUDOU.md)
- [Frontend](frontend/README.md)
- [Sistema de design](frontend/design-system/minha-oficina/MASTER.md)
- [Apresentação das telas](docs/apresentacao-7-telas-mobile.png)

## ⚠️ Observações

- O banco é compartilhado: os dados criados durante os testes ficam salvos
- A seed cria também `mecanico@oficina.com` e `recepcao@oficina.com` (senha `123456` para ambos)
- O login aceita cinco tentativas a cada 15 minutos por IP
- Não há exclusão de atendimentos pela API (o status `CANCELADO` encerra a OS)
