# 🧑‍🔧 Teste de usabilidade — mecânico de 48 anos

**Data:** 18/11/2026
**Perfil simulado:** João, 48 anos, mecânico, usa óculos de leitura, dedos grossos,
trabalha com pressa e com a oficina barulhenta. Precisa entender a tela em segundos.
**Dispositivo:** celular 390×844 (iPhone comum), conexão com a API de produção.

## Cenário da rotina

> "Cheguei pela manhã. Quero saber o que está na oficina, abrir a OS do carro que
> deixaram, atualizar o andamento, anotar o que fiz e depois conferir no histórico."

## Passo a passo (o que o João viu e fez)

| # | Ação do João | Observação da experiência |
|---|---|---|
| 1 | Abriu o link no celular | Tela de login limpa, logotipo grande e campo de e-mail com 16,8px — leu sem esforço |
| 2 | Digitou e-mail e senha, tocou em **Entrar na oficina** | Botão com 56px de altura e 16,8px de fonte — alvo fácil, não errou o dedo |
| 3 | Chegou ao Painel | Saudação "Bom dia, Carlos" em 28px. Entendeu de imediato os 4 números do resumo |
| 4 | Tocou no alerta amarelo "3 aguardando atendimento" | Foi direto para Ordens já filtradas — não precisou procurar |
| 5 | Tocou em **Ordens** na barra inferior | Ícone ativo preenchido em teal ajudou a saber onde estava |
| 6 | Observou a lista | **Cartões inteiros coloridos por status**: amarelo = aguardando, azul = em serviço, verde = pronto, teal = finalizado, vermelho = cancelado. Entendeu sem ler o badge |
| 7 | Tocou em uma OS | Detalhe com linhas empilhadas (rótulo em cima, valor embaixo) — leu "Serviço realizado" sem cortes |
| 8 | Tocou em **Atualizar status** | Modal mostrou só a próxima etapa válida — não teve que decidir entre opções confusas |
| 9 | Tocou em **Editar atendimento** | Campos grandes, diagnosticou e anotou o serviço feito |
| 10 | Usou **Voltar** no topo | Voltou para a lista sem se perder |
| 11 | **Menu → Histórico** | Confirmou a OS finalizada e o total em reais do período |

## Medições feitas no navegador (produção)

| Elemento | Fonte | Altura do alvo | Avaliação |
|---|---|---|---|
| Botão "Entrar na oficina" | 16,8px | 56px | ✅ Ótimo |
| Campo de e-mail | 16,8px | 56px | ✅ Ótimo |
| Rodapé do login | 16px | 19px | ✅ Legível |
| Título das telas | 28px | 64px | ✅ Ótimo |
| Número do resumo | 40px | 40px | ✅ Ótimo |
| Rótulo do resumo ("Aguardando") | 15,7px | 19px | ⚠️ Limítrofe |
| Dica "Toque para filtrar" | 12,2px | 15px | ❌ Pequena |
| Subtítulo do alerta | 13,4px | — | ❌ Pequena |
| Kicker "MINHA OFICINA" | 11px | 15px | ❌ Pequeno (decorativo) |
| Navegação inferior | 16px | 64px | ✅ Ótimo |
| Avatar "CC / Perfil" | 16px | 54px | ✅ Com rótulo |
| Pílula de status | 14,7px | ~36px | ✅ Melhorada |

## Pontos fortes percebidos

- **Botões grandes e com contraste**: não houve erro de toque durante o teste
- **Cartões coloridos por status**: a cor transmitiu a informação antes da leitura — decisiva para quem tem pressa
- **Fluxo de status guiado**: o modal mostra apenas a próxima etapa, sem ambiguidade
- **Botão Voltar presente em todas as telas**: o João nunca se sentiu "perdido"
- **Navegação inferior com item ativo preenchido**: orientação visual clara

## Atritos encontrados (ainda pendentes)

1. **"Toque para filtrar" (12,2px)** e o **subtítulo do alerta (13,4px)** ficam abaixo dos 16px recomendados para o público — o João precisou aproximar o celular
2. **Kicker "MINHA OFICINA" (11px)** é decorativo, mas ainda assim pequeno
3. **Rótulo dos cards de resumo (15,7px)** está no limite; subir para 16px daria folga
4. ~~A barra inferior mostrava o nome somente no item ativo.~~ **Corrigido por decisão do usuário:** todos os rótulos (Painel, Clientes, Nova OS, Ordens, Menu) agora ficam sempre visíveis, para que o usuário nunca precise adivinhar o que cada ícone faz

## Conclusão

O fluxo de trabalho foi **concluído com sucesso**, sem erros e sem necessidade de ajuda.
A mudança mais bem avaliada foi o **cartão inteiro colorido pelo status**: o João
conseguiu "bater o olho e saber o que fazer", exatamente o objetivo do produto.

**Nota do teste: B+.** Para chegar a A, basta elevar os textos auxiliares para 16px
(ACH-14, ACH-15, ACH-16, ACH-20 do relatório de auditoria) e considerar exibir os
rótulos da barra inferior em todas as posições.
