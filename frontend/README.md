# Minha Oficina — Frontend mobile

Aplicativo mobile em React + TypeScript que consome a API do backend.
Interface em português, com letras grandes, alto contraste e botões fáceis de tocar.

## Executar

```bash
cd frontend
npm install
cp .env.example .env   # ajuste VITE_API_URL se o backend não estiver na 3333
npm run dev
```

Abra `http://localhost:5173`. Para testar como celular, use o modo responsivo
do navegador (largura 390px) ou abra pelo celular na mesma rede.

## Compilar

```bash
npm run build
npm run preview
```

Saída em `dist/`.

## Autenticação

O login usa `POST /auth/login`. O token JWT é guardado no `localStorage` e
enviado como `Authorization: Bearer <token>` em todas as chamadas. Ao abrir o
app, `GET /auth/me` valida a sessão. Respostas `401` encerram a sessão.

## Rotas da API utilizadas

| Módulo | Rotas |
|---|---|
| Auth | `POST /auth/login`, `GET /auth/me` |
| Dashboard | `GET /dashboard` (com `dataInicio`/`dataFim`) |
| Clientes | `GET/POST /clientes`, `GET/PUT/DELETE /clientes/:id`, `GET /clientes/cpf/:cpf`, `GET /clientes/:id/veiculos`, `GET /clientes/:id/atendimentos` |
| Veículos | `GET/POST /veiculos`, `GET/PUT/DELETE /veiculos/:id`, `GET /veiculos/placa/:placa`, `GET /veiculos/:id/atendimentos` |
| Atendimentos | `GET/POST /atendimentos`, `GET/PUT /atendimentos/:id`, `GET /atendimentos/veiculos-na-oficina`, `PATCH /atendimentos/:id/cancelar` |
| Fluxo | `GET /fluxo-atendimento/:id/fluxo`, `GET /fluxo-atendimento/:id/transicoes`, `PATCH /fluxo-atendimento/:id/status` |
| Histórico | `GET /historico/atendimentos/:id/status`, `GET /historico/veiculos/:id/atendimentos`, `GET /historico/clientes/:id/atendimentos` |
| Usuários | `GET/POST /usuarios`, `GET /usuarios/:id`, `PATCH /usuarios/:id`, `PATCH /usuarios/:id/desativar` |

## Telas

- **Painel** — resumo do dashboard e ordens recentes
- **Clientes** — lista, cadastro, edição, exclusão e busca por CPF
- **Cliente e veículos** — veículos do cliente, cadastro, edição, exclusão e busca por placa
- **Nova OS** — abertura de atendimento
- **Ordens** — filtros por status, busca e veículos na oficina
- **Detalhe da OS** — andamento, transições válidas, histórico e edição
- **Histórico** — serviços finalizados por período
- **Buscas** — localização por CPF ou placa
- **Na oficina** — veículos em atendimento
- **Usuários** — administração da equipe
- **Menu** — acesso aos recursos adicionais e logout

## Estrutura

```
src/
├── App.tsx                  # navegação e composição das telas
├── context/AuthContext.tsx  # sessão do usuário
├── services/api.ts          # cliente HTTP e token
├── services/endpoints.ts    # todas as rotas da API
├── hooks/useApiData.ts      # carregamento de dados
├── components/              # componentes reutilizáveis
├── components/telas/        # telas do aplicativo
├── types/                   # contratos TypeScript
└── styles/                  # estilos mobile
```
