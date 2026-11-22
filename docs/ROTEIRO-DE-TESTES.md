# 🧪 Roteiro de testes — Minha Oficina

Este roteiro permite validar o sistema em **5 a 10 minutos**, usando apenas o
navegador. Não é necessário instalar nada.

## Preparação

- Link do aplicativo: https://minha-oficina-frontend.vercel.app
- Link da API: https://minha-oficina-api.onrender.com
- Quadro de planejamento (Miro): https://miro.com/welcomeonboard/THRBRC85WmJ6SE5ENnlZaHg0bCtNaWYwV29hc2ZUbnVZNGdVL1JremhsM0pwTmwzK1F1eVd6aHF0RDRxQmtvTDZKSlNRWlA3VzhLeDQ1YWx1RUVpL1VZTlhyQzdHUDhmU3Q4cEQyQ3FKb2ZDdnE1aUxIckUrYWNTWE1WWmIwakZBd044SHFHaVlWYWk0d3NxeHNmeG9BPT0hdjE=?share_link_id=105175980003
- Usuário: `admin@oficina.com`
- Senha: `123456` — Carlos Costa, o dono da oficina

Outros acessos para comparar permissões:

| E-mail | Senha | Papel |
|---|---|---|
| `mecanico@oficina.com` | `123456` | Mecânico |
| `recepcao@oficina.com` | `123456` | Recepcionista |

> Recomenda-se usar o modo responsivo do navegador (largura 390px) ou o celular.
> O banco é compartilhado, portanto os registros criados permanecem salvos.
> Atenção: o sistema permite apenas cinco tentativas de login a cada 15 minutos.
> Repetir login muitas vezes seguidas pode bloquear temporariamente o acesso.

---

## 1. Acesso e autenticação

| Passo | Ação | Resultado esperado |
|---|---|---|
| 1.1 | Abrir o link do aplicativo | Tela de login com o logotipo "Minha Oficina" |
| 1.2 | Informar e-mail e senha e tocar em **Entrar na oficina** | Abertura do Painel com saudação "Bom dia, Carlos" |
| 1.3 | Recarregar a página (F5) | Permanece logado (sessão mantida por token) |
| 1.4 | Tocar no avatar com as iniciais e a palavra **Perfil** → **Sair da conta** | Volta para a tela de login |
| 1.5 | Entrar de novo e abrir **Perfil** | É possível alterar a senha informando a atual e a nova |

**Validação negativa:** tentar login com senha errada deve exibir a mensagem
`E-mail ou senha inválidos`.

## 2. Painel (dashboard)

| Passo | Ação | Resultado esperado |
|---|---|---|
| 2.1 | Após o login, observar "Resumo da oficina" | Quatro cartões com contagens de `Aguardando`, `Em serviço`, `Pronto` e `Finalizado` |
| 2.2 | Tocar em um dos cartões | Abre a lista de Ordens já filtrada pelo status escolhido |
| 2.3 | Tocar em **Ver todas** | Abre a lista completa de ordens |

## 3. Clientes

| Passo | Ação | Resultado esperado |
|---|---|---|
| 3.1 | Toque em **Clientes** na barra inferior | Lista de clientes com nome, telefone e CPF |
| 3.2 | Toque em **+ Novo** | Abre o formulário de cadastro |
| 3.3 | Preencha nome, telefone, e-mail, CPF, endereço e toque em **Salvar** | Mensagem "Cliente cadastrado com sucesso" e cliente aparece na lista |
| 3.4 | Use o campo de busca com parte do nome | Lista filtrada |
| 3.5 | Toque em **Buscar CPF**, informe `111.222.333-44` | Abre diretamente o cliente Joao Silva |

## 4. Veículos e ordem de serviço

| Passo | Ação | Resultado esperado |
|---|---|---|
| 4.1 | Abra um cliente da lista | Tela "Cliente e veículos" |
| 4.2 | Toque em **+ Novo** em Veículos e cadastre placa, marca, modelo e ano | Mensagem de sucesso e veículo na lista |
| 4.3 | Toque em **+ Nova OS** no veículo | Tela com cliente e veículo já preenchidos |
| 4.4 | Preencha problema relatado e toque em **Abrir ordem de serviço** | Mensagem "OS #... aberta com sucesso" e abertura do detalhe da OS |
| 4.5 | No detalhe, confira os dados em um único cartão | Problema, serviço previsto, responsável e orçamento |

## 5. Fluxo de status

| Passo | Ação | Resultado esperado |
|---|---|---|
| 5.1 | No detalhe da OS, toque em **Atualizar status** | Modal mostra apenas a próxima transição válida |
| 5.2 | Selecione **Em serviço** | Status muda e a linha do tempo avança |
| 5.3 | Repita para **Pronto** e **Finalizado** | A OS aparece no Histórico |
| 5.4 | Tente atualizar uma OS finalizada | Botão desabilitado (o fluxo não permite mais transições) |
| 5.5 | Em **Mais opções → Cancelar ordem** | Status passa a `Cancelado` e o histórico registra a mudança |

**Regra de negócio:** as transições válidas são
`AGUARDANDO → EM_SERVICO → PRONTO → FINALIZADO`. `CANCELADO` encerra o atendimento.

## 6. Ordens, histórico e buscas

| Passo | Ação | Resultado esperado |
|---|---|---|
| 6.1 | Toque em **Ordens** na barra inferior | Lista de OS com o cartão inteiro colorido pelo status: amarelo, azul, verde, teal ou vermelho |
| 6.2 | Toque nas abas de status | Lista filtrada |
| 6.3 | Toque em **Veículos na oficina** | Veículos com atendimento em andamento |
| 6.4 | **Menu → Histórico** | Serviços finalizados e total em R$ do período |
| 6.5 | Troque entre 30 dias / 3 meses / 12 meses | Lista e total recalculados |
| 6.6 | **Menu → Buscas → Por placa**, informe `ABC1D23` | Localiza o Corolla e mostra seu histórico |

## 7. Usuários

| Passo | Ação | Resultado esperado |
|---|---|---|
| 7.1 | **Menu → Usuários** | Lista da equipe com nome, e-mail e situação |
| 7.2 | **+ Novo**, preencha nome/e-mail/senha | Usuário cadastrado e listado |
| 7.3 | Toque no ícone de editar | Alteração salva com mensagem de sucesso |
| 7.4 | Desative o usuário criado | Situação passa a "Desativado" |
| 7.5 | Toque no ícone de reativar | Situação volta a "Ativo" |

O papel aparece na linha do usuário: Dono, Mecânico ou Recepcionista. Ao entrar
com o e-mail do mecânico, a opção **Usuários** não aparece no Menu — ela é só do dono.

---

## Verificação rápida da API

Acesse https://minha-oficina-api.onrender.com no navegador:
deve retornar `{"message":"API Minha Oficina funcionando"}`.

Para verificar a autenticação diretamente:

```bash
curl -X POST https://minha-oficina-api.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@oficina.com","senha":"123456"}'
```

Retorno esperado: objeto com `token`, `expiresIn` (900 segundos) e os dados do
usuário, incluindo `"role":"ADMIN"`.

## Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| Tela de login não aparece | Cache do navegador | Limpar dados do site e recarregar |
| "Não foi possível conectar ao servidor" | API indisponível | Testar o link da API e aguardar o cold start da função serverless |
| Listas vazias | Período/filtro muito restrito | Trocar o filtro ou o período |
| Não consegue excluir cliente/veículo | Existem atendimentos vinculados | Cancelar/finalizar a OS ou usar outro registro |
| "Muitas tentativas. Tente novamente em 15 minutos" | Cinco logins seguidos | Aguardar 15 minutos ou usar outra aba já autenticada |
| "Você não tem permissão para esta ação" | Usuário sem papel para a ação | Entrar com a conta do dono para testar tudo |

## Resultado esperado ao final

- Cadastro de clientes e veículos funcionando
- Abertura de OS e evolução completa do status
- Histórico e buscas retornando dados reais do banco
- Nenhum erro exibido no console do navegador
