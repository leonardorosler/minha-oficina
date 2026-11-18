# 🔧 Minha Oficina

**Minha Oficina** é um sistema web desenvolvido para auxiliar **mecânicos autônomos e pequenas oficinas** no controle dos veículos que estão sob sua responsabilidade.

O projeto tem como foco oferecer uma solução simples para que o mecânico consiga visualizar rapidamente **quais veículos estão na oficina, por que estão ali e o que precisa ser feito em cada um**.

## 💡 Problema

Em pequenas oficinas, informações sobre veículos e serviços muitas vezes ficam espalhadas entre:

- mensagens de WhatsApp;
- cadernos e papéis;
- anotações informais;
- memória do próprio mecânico.

Isso pode se tornar um problema principalmente quando um veículo permanece vários dias ou semanas na oficina.

Por exemplo, um cliente pode deixar seu veículo, receber um orçamento e pedir para que o serviço seja realizado somente algumas semanas depois. Quando chegar o momento de realizar o serviço, o mecânico precisa recuperar facilmente tudo o que havia sido combinado.

## 🎯 Solução

O **Minha Oficina** funciona como uma **memória digital da oficina**, centralizando as principais informações de cada atendimento.

O mecânico poderá registrar:

- clientes;
- veículos;
- entrada do veículo na oficina;
- problema relatado pelo cliente;
- diagnóstico;
- serviço previsto;
- orçamento;
- observações;
- situação atual do atendimento;
- histórico de atendimentos do veículo.

> **Bater o olho. Lembrar o contexto. Saber o próximo passo.**

## 🔄 Fluxo principal

```text
Cliente
   ↓
Veículo
   ↓
Entrada na oficina
   ↓
Problema relatado
   ↓
Diagnóstico e orçamento
   ↓
Aguardando / Em serviço
   ↓
Pronto
   ↓
Finalizado
   ↓
Histórico
```

## 🚦 Status dos atendimentos

Inicialmente, os atendimentos poderão possuir os seguintes status:

- `AGUARDANDO`
- `EM_SERVICO`
- `PRONTO`
- `FINALIZADO`
- `CANCELADO`

A transição válida é `AGUARDANDO → EM_SERVICO → PRONTO → FINALIZADO`. O status `CANCELADO` encerra o atendimento. Informações específicas sobre o motivo de um veículo estar aguardando podem ser registradas nas observações.

## 🚀 MVP

O MVP do projeto contempla:

- Cadastro de clientes;
- Cadastro de veículos;
- Registro de entrada do veículo;
- Registro do problema relatado;
- Diagnóstico;
- Serviço previsto;
- Orçamento;
- Observações;
- Alteração de status;
- Visualização dos veículos presentes na oficina;
- Histórico de atendimentos.

## 🛠️ Tecnologias

### Front-end

- React
- TypeScript
- CSS

### Back-end

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL

## 📁 Estrutura do repositório

```text
minha-oficina/
├── minha-oficina/
│   └── frontend/   # Aplicativo mobile (React + Vite)
├── backend/        # API e regras de negócio
├── minha-oficina-offline/
│   └── versao-editavel/  # Protótipo navegável original
├── docs/           # Documentação do projeto
└── README.md
```

O front-end e o back-end permanecem no mesmo repositório, mas são **projetos independentes**, com dependências, build e execução separados. O front-end consome a API exclusivamente por HTTP, usando o token JWT no cabeçalho `Authorization: Bearer`.

### Como executar

```bash
# Backend (porta 3333)
cd backend
npm install
npm run dev

# Frontend (porta 5173)
cd minha-oficina/frontend
npm install
npm run dev
```

O endereço da API pode ser configurado em `minha-oficina/frontend/.env` (ver `.env.example`). O padrão é `http://localhost:3333`.

Usuário de demonstração (seed): `admin@oficina.com` / `123456`.

### Publicação

As aplicações são publicadas separadamente na Vercel:

| Aplicação | URL de produção |
|---|---|
| Frontend | https://minha-oficina-frontend.vercel.app |
| API | https://minha-oficina-api.vercel.app |
| Quadro de planejamento (Miro) | https://miro.com/welcomeonboard/THRBRC85WmJ6SE5ENnlZaHg0bCtNaWYwV29hc2ZUbnVZNGdVL1JremhsM0pwTmwzK1F1eVd6aHF0RDRxQmtvTDZKSlNRWlA3VzhLeDQ1YWx1RUVpL1VZTlhyQzdHUDhmU3Q4cEQyQ3FKb2ZDdnE1aUxIckUrYWNTWE1WWmIwakZBd044SHFHaVlWYWk0d3NxeHNmeG9BPT0hdjE=?share_link_id=105175980003 |

O projeto da API usa `api/index.ts` como função serverless e `vercel.json` com
redirecionamento de todas as rotas. As variáveis `DATABASE_URL` e `JWT_SECRET`
são configuradas como segredos no projeto `minha-oficina-api`. O frontend usa a
variável `VITE_API_URL` apontando para a API publicada.

## 📚 Documentação

- [README principal](../README.md) — acesso em produção, credenciais e início rápido
- [Roteiro de testes](./ROTEIRO-DE-TESTES.md) — passo a passo para validar o sistema no navegador
- [Auditoria UI/UX](./AUDITORIA-UI-UX.md) — achados, severidades e prioridades
- [Teste com mecânico de 48 anos](./TESTE-USUARIO-48ANOS.md) — rotina real e medições de legibilidade
- [O que mudou e por quê](./O-QUE-MUDOU.md) — decisões tomadas nesta rodada, em linguagem simples
- [README do frontend](../minha-oficina/frontend/README.md) — rotas da API, telas e estrutura do app
- [Sistema de design](../minha-oficina/frontend/design-system/minha-oficina/MASTER.md) — paleta, tipografia e padrões visuais

Este arquivo descreve o problema, a solução, o fluxo de atendimento e a estrutura do repositório. O roteiro de testes traz os cenários completos com resultados esperados.

## 🎓 Contexto acadêmico

Este projeto está sendo desenvolvido como um **projeto acadêmico**, com foco na aplicação prática dos conceitos estudados durante o curso.

Por possuir um prazo limitado de desenvolvimento, o projeto prioriza um **MVP simples e funcional**, evitando funcionalidades que não sejam essenciais para solucionar o problema proposto.

## 🔮 Possíveis evoluções

Funcionalidades que podem ser consideradas futuramente:

- controle de peças e estoque;
- integração com WhatsApp;
- fotos e anexos;
- relatórios;
- agenda;
- controle financeiro;
- notificações.

Essas funcionalidades **não fazem parte do escopo inicial do MVP**.