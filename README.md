# 🔧 Minha Oficina

Sistema de gestão para oficinas mecânicas: cadastro de clientes e veículos,
abertura de ordens de serviço, controle do fluxo de atendimento e histórico.

**Frontend mobile (React) e backend (Express/Prisma) são projetos separados**,
publicados em URLs diferentes e comunicando-se por API HTTP com autenticação JWT.

---

## 🌐 Acesso em produção (forma mais rápida de testar)

| Aplicação | Link |
|---|---|
| **Aplicativo mobile** | https://minha-oficina-frontend.vercel.app |
| **API** (verificação) | https://minha-oficina-api.vercel.app |
| **Quadro no Miro** (planejamento) | https://miro.com/welcomeonboard/THRBRC85WmJ6SE5ENnlZaHg0bCtNaWYwV29hc2ZUbnVZNGdVL1JremhsM0pwTmwzK1F1eVd6aHF0RDRxQmtvTDZKSlNRWlA3VzhLeDQ1YWx1RUVpL1VZTlhyQzdHUDhmU3Q4cEQyQ3FKb2ZDdnE1aUxIckUrYWNTWE1WWmIwakZBd044SHFHaVlWYWk0d3NxeHNmeG9BPT0hdjE=?share_link_id=105175980003 |

**Login de demonstração:** `admin@oficina.com` · senha `123456` (Carlos Costa, o dono da oficina)

> Dica: abra o link do aplicativo no celular ou use o modo responsivo do navegador
> com largura de 390px para ver a interface mobile como foi projetada.
> A API é usada pelo aplicativo; abrir o link dela no navegador mostra apenas
> a mensagem `API Minha Oficina funcionando`.

➡️ **[Roteiro completo de teste para o professor](docs/ROTEIRO-DE-TESTES.md)**

---

## ▶️ Executar localmente

Pré-requisitos: Node.js 20+ e acesso ao banco PostgreSQL (Neon).

```bash
# 1) Backend — porta 3333
cd backend
npm install
npm run dev

# 2) Frontend — porta 5173 (em outro terminal)
cd minha-oficina/frontend
npm install
cp .env.example .env
npm run dev
```

Por padrão o frontend aponta para `http://localhost:3333`. Para apontar o
frontend local para a API publicada, configure `VITE_API_URL` no `.env`.

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
| Mecânico | Abrir e atualizar os atendimentos que criou, além de consultar os demais dados |
| Recepcionista | Cadastrar clientes e veículos e abrir ordens de serviço |

O card de cada ordem fica colorido conforme o status: amarelo (aguardando), azul
(em serviço), verde (pronto), teal (finalizado) e vermelho (cancelado). Assim dá
para entender a situação de relance, sem precisar ler o texto.

## 📁 Estrutura

```text
minha-oficina/
├── backend/                       # API Express + Prisma + PostgreSQL
│   ├── api/index.ts               # handler serverless (Vercel)
│   └── src/modules/               # auth, dashboard, clientes, veículos,
│                                  # atendimentos, fluxo, histórico, usuários
├── minha-oficina/frontend/        # aplicativo mobile React + Vite
│   ├── src/components/telas/      # telas do aplicativo
│   ├── src/services/endpoints.ts  # todas as rotas da API
│   ├── src/context/AuthContext.tsx
│   ├── design-system/             # identidade visual
│   └── README.md                  # documentação do frontend
├── minha-oficina-offline/         # protótipo navegável original
├── docs/                          # documentação detalhada e roteiro de testes
└── README.md                      # este arquivo
```

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Vite, CSS
- **Backend**: Node.js, Express 5, TypeScript, Prisma 7, PostgreSQL (Neon)
- **Deploy**: Vercel (dois projetos independentes)

## 📚 Documentação

- [Visão geral do projeto](docs/readme.md)
- [Roteiro de testes](docs/ROTEIRO-DE-TESTES.md)
- [Auditoria UI/UX](docs/AUDITORIA-UI-UX.md)
- [Teste com mecânico de 48 anos](docs/TESTE-USUARIO-48ANOS.md)
- [O que mudou e por quê](docs/O-QUE-MUDOU.md)
- [Frontend](minha-oficina/frontend/README.md)
- [Sistema de design](minha-oficina/frontend/design-system/minha-oficina/MASTER.md)

## ⚠️ Observações

- O banco é compartilhado: os dados criados durante os testes ficam salvos
- A seed cria também `mecanico@oficina.com` e `recepcao@oficina.com` (senha `123456` para ambos)
- O login aceita cinco tentativas a cada 15 minutos por IP
- Não há exclusão de atendimentos pela API (o status `CANCELADO` encerra a OS)
