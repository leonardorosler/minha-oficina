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

Informações específicas sobre o motivo de um veículo estar aguardando podem ser registradas nas observações.

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
├── frontend/       # Aplicação web
├── backend/        # API e regras de negócio
├── docs/           # Documentação do projeto
└── README.md
```

O front-end e o back-end permanecem no mesmo repositório, mas podem ser publicados separadamente.

## 📚 Documentação

A documentação detalhada do projeto está disponível na pasta [`docs`](./docs).

Ela contém informações sobre o problema, requisitos, regras de negócio, modelo de dados, fluxo do sistema e decisões tomadas durante o desenvolvimento.

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