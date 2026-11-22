# Guia de identidade visual — Minha Oficina

Este guia reúne as decisões visuais do aplicativo. Ele serve para quem for mexer
no front-end manter tudo consistente: mesma paleta, mesmos tamanhos e o mesmo
jeito de conduzir o usuário.

## Cores

O azul profundo é a base da marca. O teal marca ações e o item ativo da
navegação. O âmbar aparece nos avisos que pedem atenção.

| Uso | Cor |
|---|---|
| Marca e títulos | `#0f2a43` |
| Ações principais e item ativo | `#0d9488` |
| Avisos e destaques | `#f59e0b` |
| Texto principal | `#0f172a` |
| Texto secundário | `#526175` |
| Fundo | `#f1f5f9` |
| Cartões | `#ffffff` |
| Bordas | `#e2e8f0` |
| Sucesso | `#059669` |
| Erro | `#dc2626` |

Nos cartões de ordem de serviço a cor assume o status inteiro: amarelo para
aguardando, azul para em serviço, verde para pronto, teal para finalizado e
vermelho para cancelado.

## Tipografia

Fonte Inter, com pesos 400 a 900. O texto informativo não fica abaixo de 16px.
Títulos de tela usam 28px e negrito; números do resumo usam 40px. Os rótulos
auxiliares podem ser menores, mas ainda precisam ser legíveis sem esforço.

## Espaçamento e forma

Cartões com cantos arredondados de 18px, borda clara e sombra discreta. Botões
principais com pelo menos 56px de altura. Alvos de toque nunca menores que 44px.
O afastamento entre blocos segue uma escala simples: 8, 12, 16, 24 e 32px.

## Componentes

- **Botão principal**: teal preenchido, texto branco, cantos de 16px
- **Botão secundário**: fundo teal claro, texto teal escuro
- **Botão fantasma**: fundo branco, borda e texto teal
- **Cartão**: fundo branco, borda `#e2e8f0`, raio de 18px
- **Campo de texto**: borda clara, 56px de altura, foco com anel teal
- **Badge**: pílula com ponto colorido, fundo claro conforme o status
- **Modal**: vem de baixo, com alça no topo, cantos arredondados e botões grandes

## Navegação

A barra inferior tem cinco posições: Painel, Clientes, Nova OS, Ordens e Menu.
O item ativo fica em teal preenchido. Todos os nomes aparecem escritos o tempo
todo, inclusive nos itens inativos — o usuário não deve precisar adivinhar o
que cada ícone faz. O botão central é o de criar nova ordem.

## Decisões do produto

O sistema é do Carlos, dono da oficina, e foi pensado para uso rápido no celular.
Por isso a leitura visual vem antes da leitura do texto: cor no cartão da OS,
ícone ativo preenchido, rótulos sempre presentes.

Quando uma tela atualiza, os dados que já estavam lá permanecem visíveis. Isso
evita o "piscar" de carregamento ao trocar de aba. As listagens vêm em blocos de
20 itens, com botão para carregar mais.

## Antes de entregar

- Ícones em SVG, nunca emoji
- Contraste de texto de pelo menos 4,5:1
- Foco visível em elementos interativos
- Sem rolagem horizontal no celular
- Respeitar a preferência de movimento reduzido
- Testar em 320px, 390px e no computador
