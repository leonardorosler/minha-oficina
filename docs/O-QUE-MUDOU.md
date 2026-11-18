# O que mudou no sistema

Este registro conta, de forma simples, o que foi feito na última rodada de trabalho
e por quê. Ele complementa o README e o roteiro de testes; aqui o objetivo é
deixar claro o raciocínio por trás das decisões.

## O sistema é do Carlos

O usuário principal é o Carlos, dono da oficina. Ele tem 48 anos e usa o celular
no dia a dia, muitas vezes com pressa e com óculos de leitura. Isso pesou em
quase todas as escolhas abaixo. O login dele é `admin@oficina.com` e, ao entrar,
o painel diz "Bom dia, Carlos" — o nome vem do cadastro, não está fixo no código.

Quando o sistema foi pensado para uma pessoa só, algumas liberdades eram
aceitáveis. Agora que existem vários usuários, foi preciso colocar ordem nisso.

## Papéis e permissões

Antes, qualquer pessoa logada podia fazer qualquer coisa. Isso mudou. Existem
três papéis:

- **Dono** — é o Carlos. Pode excluir clientes e veículos, gerenciar usuários e
  cancelar ordens.
- **Mecânico** — mexe nos atendimentos que abriu e consulta o restante.
- **Recepcionista** — cadastra clientes e veículos e abre ordens de serviço.

As regras ficam no backend, no middleware `autorizar`. Mesmo que alguém tente
chamar a API diretamente, a resposta é 403 quando o papel não permite a ação.
A tela de Usuários aparece no Menu somente para o dono, mas a proteção real está
no servidor — esconder o botão é só cortesia com quem usa a interface.

Também foi fechado um furo importante: um mecânico não consegue mais editar uma
ordem que não criou, apenas mudando o número na URL. A verificação
`donoOuAdmin` cuida disso nas rotas de edição, cancelamento e mudança de status.

## Login mais seguro

O token de acesso agora dura 15 minutos, contra um dia antes. Para não obrigar o
Carlos a digitar a senha toda hora, entrou o refresh token: ele fica num cookie
HttpOnly, inacessível ao JavaScript da página, e é rotacionado a cada uso. Quando
o access token expira, o próprio aplicativo renova a sessão e repete a chamada —
sem atrapalhar quem está usando.

Também limitamos tentativas de login a cinco a cada quinze minutos. Isso já foi
testado: na sexta tentativa a API responde que houve muitas tentativas. O CORS
deixou de aceitar qualquer origem e agora só libera o endereço do app e o
endereço local de desenvolvimento.

O Carlos pode trocar a própria senha pelo botão de perfil, e usuários inativos
podem ser reativados na tela de Usuários. Antes só existia o desativar.

## Auditoria das mudanças de status

Sempre que uma ordem muda de etapa, o histórico agora registra **quem** fez a
mudança. Antes o nome de quem alterava o status era passado para o serviço mas
acabava descartado. Foi acrescentado o campo de usuário no histórico de status,
junto com a migration. No detalhe da ordem aparece, por exemplo, "18/11/2026,
13:25 · por Carlos Costa".

A mesma informação passou a valer para abertura, edição e cancelamento de
atendimentos.

## Problemas que apareceram nos testes

Algumas coisas só apareceram quando o sistema foi usado de verdade:

- Excluir um cliente ou veículo com atendimentos vinculados devolvia erro 500.
  Agora devolve 409 com uma frase explicando o motivo.
- Um JSON malformado derrubava o servidor. Entrou um tratamento de erro central
  que responde 400 e mantém a API de pé.
- Depois de mudar o status da ordem, o modal continuava oferecendo a transição
  antiga por alguns segundos. Corrigido recarregando as transições junto com o
  atendimento.
- A lista do histórico global vinha do dashboard, que trazia apenas cinco
  finalizados. Passou a consultar a rota de atendimentos com filtro de período,
  então o total em reais finalmente confere com a lista.
- O serviço realizado era salvo mas não aparecia no detalhe. Agora aparece.
- Orçamento digitado com vírgula (`250,50`) falhava na validação. O app converte
  para ponto antes de enviar.

## Mudanças na interface

O cartão de cada ordem assume a cor do status: amarelo quando está aguardando,
azul em serviço, verde pronto, teal finalizado e vermelho cancelado. Isso foi
pedido expressamente porque o Carlos entende a situação de relance, sem precisar
ler o badge.

A barra inferior manteve o desenho em cinco ícones, mas **todos os nomes ficam
sempre visíveis**. A referência era o Instagram, porém decidimos não esconder os
rótulos do item inativo: ninguém deve ficar adivinhando o que significa cada
ícone. O botão central continua sendo o de criar nova OS.

Trocar de aba na lista de ordens não mostra mais aquele esqueleto de carregamento
apagando tudo. Os dados anteriores ficam na tela enquanto os novos chegam, com
uma leve redução de opacidade para dar a entender que algo está sendo atualizado.
A mesma ideia vale para as outras listas.

As listagens de clientes e ordens ganharam paginação de 20 em 20, com botão de
carregar mais. Antes a API devolvia tudo de uma vez.

## O que ficou de fora

Não foi criada separação por oficina. O sistema continua atendendo uma única
oficina, que é o caso do Carlos. Se um dia ele quiser usar para duas unidades,
aí sim será preciso introduzir o conceito de oficina e separar os dados.

## Onde cada coisa está

Regras de acesso: `backend/src/modules/middleware/autorizar.middleware.ts`.
Emissão e renovação de tokens: `backend/src/modules/auth/`.
Histórico de status: `backend/src/modules/fluxo-atendimento/` e
`backend/src/modules/historico/`.
Tabela de usuários, papéis e refresh tokens: `backend/prisma/schema.prisma`.
Na interface, o cliente HTTP com renovação automática está em
`frontend/src/services/api.ts`, e as telas em `frontend/src/components/telas/`.

## Como foi verificado

Rodamos a API local e testamos as rotas de leitura e escrita, incluindo os casos
de erro. Depois fizemos uma rotina completa no celular, no papel do Carlos:
entrar, ver o resumo, abrir ordem, mudar status, registrar o serviço, finalizar e
conferir no histórico. O fluxo inteiro passou sem erros no console do navegador.
Os documentos `AUDITORIA-UI-UX.md` e `TESTE-USUARIO-48ANOS.md` trazem os detalhes
dessa parte.
