# Relatório de Auditoria UI/UX — App Mobile "Minha Oficina"

**Data:** 18/11/2026  
**Escopo:** Análise baseada em evidências visuais de 12 capturas de tela (produção)  
**Público-alvo:** Senhor de 48 anos (prioridade: letras grandes, alto contraste, botões grandes, simplicidade)  
**Identidade visual:** Azul profundo #0f2a43, teal #0d9488, âmbar #f59e0b, fonte Inter  
**Modo:** Apenas leitura de imagens. Nenhum arquivo foi modificado.

---

## 1. Resumo Executivo

**Nota geral: C**

O app apresenta uma identidade visual coesa, cores consistentes e uma boa estrutura de navegação (barra inferior estilo Instagram, cards bem espaçados, hierarquia clara em telas principais). No entanto, há **problemas críticos de corte de texto** que tornam partes da interface inusáveis em telas pequenas e no modal de seleção, além de **textos pequenos e baixo contraste** que prejudicam a leitura para o público-alvo (48 anos). A barra inferior tem ícones pequenos e, em algumas telas, sem rótulo de texto.

### O que está bom (pontos fortes)
- Cores consistentes entre telas (azul #0f2a43, teal #0d9488, âmbar #f59e0b)
- Barra inferior estilo Instagram com estado ativo bem marcado (teal preenchido)
- Cards com bom espaçamento, raios arredondados consistentes e sombra suave
- Botões principais (teal preenchido) grandes e com bom contraste
- Hierarquia visual clara no painel (02) e na listagem de clientes (03)
- Estados de status bem diferenciados por cor (Cancelado = vermelho, Finalizado = verde, Aguardando = cinza)

### O que precisa de atenção
- Textos cortados em 320px (filtros de período) e no modal de seleção de cliente
- Texto de corpo e rótulos auxiliares muito pequenos para o público-alvo
- Botão "cc" sem rótulo no painel
- Ícones da barra inferior pequenos e, em várias telas, sem label

---

## 2. Totais de Achados por Severidade

| Severidade | Quantidade |
|------------|------------|
| Crítico    | 2 |
| Alto       | 4 |
| Médio      | 6 |
| Baixo      | 9 |
| **Total**  | **21** |

---

## 3. Tabela de Achados

| ID | Tela | Categoria | Descrição objetiva | Evidência (arquivo) | Correção recomendada |
|----|------|-----------|--------------------|---------------------|----------------------|
| ACH-01 | 09 — Modal seleção | Crítico | Último item da lista ("QA Cliente Final") fica cortado na parte inferior do modal, impossibilitando a seleção completa do último cliente visível. | 09-modal-selecao.png | Aumentar a área rolável do modal, adicionar padding inferior e garantir que o último item fique totalmente visível antes do rodapé/botão. |
| ACH-02 | 12 — Histórico 320px | Crítico | Em viewport 320px, os botões de filtro de período ("30 dias", "3 meses", "12 meses") e o resumo ("3 serviços no período") estão cortados na borda direita, tornando a tela inusável em aparelhos pequenos. | 12-historico-320px.png | Ajustar largura dos chips de filtro (flex-wrap ou scroll horizontal) e reduzir tamanho da fonte/resumo para caber em 320px sem cortes. |
| ACH-03 | 01 — Login | Alto | Texto do rodapé "Acesso restrito à equipe da oficina" é muito pequeno e de baixo contraste (cinza claro), dificultando leitura para o público-alvo de 48 anos. | 01-login.png | Aumentar o tamanho da fonte (mínimo 16px) e usar cor com maior contraste contra o fundo claro. |
| ACH-04 | 06 — Detalhe da OS | Alto | Linhas de detalhe ("Serviço realizado", "Serviço concluido QA...") estão truncadas/cortadas à direita, ocultando informação relevante da OS. | 06-detalhe-os.png | Aumentar largura da coluna de valor, permitir quebra de linha ou reduzir tamanho do texto dos rótulos/valores. |
| ACH-05 | 08 — Nova OS | Alto | Campo "Veículo" mostra "Disponível após escolher o cliente" em cinza, sem feedback visual claro de estado desabilitado (sem opacidade reduzida, sem ícone de bloqueio, sem cursor disabled). | 08-nova-os.png | Aplicar estilo visual de desabilitado (opacidade ~50%, cursor not-allowed) e manter o campo bloqueado até a seleção do cliente. |
| ACH-06 | 12 — Histórico 320px | Alto | Botões de filtro de período ("30 dias", "3 meses", "12 meses") cortados na borda direita em 320px. | 12-historico-320px.png | Mesmo que ACH-02: ajustar layout dos chips para não cortar em telas pequenas. |
| ACH-07 | 02 — Painel | Médio | Botão "cc" no canto superior direito não possui rótulo de texto; sua função é ambígua para o usuário. | 02-painel.png | Adicionar label de texto (ex: "Conta", "Perfil", "Configurações") ou tooltip explicativo. |
| ACH-08 | 03 — Clientes | Médio | Telefones e CPFs dos clientes exibidos em texto pequeno e cinza, de difícil leitura para o público-alvo. | 03-clientes.png | Aumentar tamanho da fonte dos dados de contato e usar cor com maior contraste (não cinza claro). |
| ACH-09 | 04 — Cliente e veículos | Médio | Seta de navegação à direita no card do veículo (Honda Civic) fica muito próxima da borda direita, podendo ser difícil de tocar. | 04-cliente-veiculos.png | Aumentar o padding direito do card e garantir que a seta tenha área de toque generosa (≥ 44×44px). |
| ACH-10 | 05 — Ordens | Médio | Pílulas de status ("Cancelado", "Finalizado") são pequenas, reduzindo legibilidade rápida do status da OS. | 05-ordens.png | Aumentar tamanho da fonte e padding das pílulas de status. |
| ACH-11 | Barra inferior (todas) | Médio | Ícones da barra inferior são pequenos e, em várias telas, não exibem rótulo de texto (apenas "Painel", "Clientes", "Ordens", "Nova OS", "Menu" têm label), dificultando identificação para usuário de 48 anos. | Todas as telas (barra inferior) | Aumentar tamanho dos ícones e exibir rótulo de texto abaixo em todas as 5 posições da barra inferior. |
| ACH-12 | 10 — Menu | Médio | Ícone "Sair" usa cor de alerta (vermelho/pink) mas é pequeno e sem reforço visual suficiente para uma ação destrutiva. | 10-menu.png | Aumentar o ícone, adicionar confirmação de saída e/ou usar um padrão mais claro de ação destrutiva. |
| ACH-13 | 01 — Login | Baixo | Botão "Ver" (mostrar senha) em texto pequeno. | 01-login.png | Aumentar tamanho da fonte do botão "Ver". |
| ACH-14 | 02 — Painel | Baixo | Texto "Toque para filtrar" nos cards de resumo é pequeno. | 02-painel.png | Aumentar tamanho da fonte ou remover o texto (o próprio toque já indica interatividade). |
| ACH-15 | 03 — Clientes | Baixo | Link "Buscar CPF" em texto pequeno e pouco visível. | 03-clientes.png | Aumentar tamanho e contraste do link "Buscar CPF". |
| ACH-16 | 04 — Cliente e veículos | Baixo | Links "Ver histórico" e "Ver atendimentos deste veículo" em texto pequeno. | 04-cliente-veiculos.png | Aumentar tamanho da fonte desses links secundários. |
| ACH-17 | 05 — Ordens | Baixo | Placeholder da busca "Buscar por OS, cliente ou placa" em cinza claro, baixo contraste. | 05-ordens.png | Escurecer ligeiramente o placeholder para melhorar contraste. |
| ACH-18 | 06 — Detalhe da OS | Baixo | "Q9FIM · QA Cliente Final" em texto pequeno abaixo do modelo do veículo. | 06-detalhe-os.png | Aumentar tamanho da fonte dos metadados da OS. |
| ACH-19 | 08 — Nova OS | Baixo | Placeholder "Ex.: Troca de óleo" em texto pequeno. | 08-nova-os.png | Aumentar tamanho da fonte do placeholder. |
| ACH-20 | 10 — Menu | Baixo | Subtítulo "Acesse os recursos da sua oficina" em texto pequeno. | 10-menu.png | Aumentar tamanho da fonte do subtítulo do card principal do menu. |
| ACH-21 | 11 — Histórico | Baixo | Texto "Fiat Uno e outros 2 atendimentos" em tamanho pequeno abaixo dos cards de OS. | 11-historico.png | Aumentar tamanho da fonte do resumo de atendimentos. |

---

## 4. Análise por Critério Avaliado

### (1) Hierarquia visual e legibilidade das fontes
Os títulos principais ("Bem-vindo de volta", "Bom dia, Administrador", "Clientes", "Nova OS", "Detalhe da OS") usam tamanho adequado e boam contraste. O problema está nos **textos secundários e auxiliares** (rodapés, placeholders, metadados, pílulas pequenas), que ficam abaixo do recomendado para o público-alvo de 48 anos. Recomenda-se tamanho mínimo de 16px para texto de corpo e rótulos.

### (2) Consistência de cores, espaçamentos, raios, ícones e componentes
A consistência de cores é boa: azul #0f2a43 em cabeçalhos/elementos principais, teal #0d9488 em botões primários e ativos, âmbar #f59e0b em cards de alerta/ação. Raios arredondados consistentes nos cards. Ícones da barra inferior repetidos, mas com tamanho pequeno e rótulos inconsistentes (alguns têm label, outros não).

### (3) Tamanho dos alvos de toque
Botões principais (teal) são grandes o suficiente. Porém, ícones da barra inferior, setas de navegação nos cards e pílulas de status são pequenos e podem ser difíceis de tocar com precisão para o público-alvo. Recomenda-se alvos de toque mínimo de 44×44px (diretriz WCAG).

### (4) Contraste e acessibilidade visual
Contraste adequado nos elementos principais (branco sobre teal, texto escuro sobre fundo claro). Pontos fracos: textos cinza claro (placeholders, rodapés, metadados) e pílulas pequenas. Não há evidência de modo de alto contraste nem suporte a fontes do sistema ampliadas.

### (5) Estados (vazio, carregamento, desabilitado, modal)
- **Modal:** funciona, mas tem item cortado (ACH-01).
- **Desabilitado:** o campo "Veículo" em Nova OS não comunica visualmente o estado desabilitado (ACH-05).
- **Vazio/carregamento:** não aparecem nas capturas analisadas (não há tela de carregamento ou lista vazia visível).
- Estados de status das OS estão bem diferenciados por cor.

### (6) Responsividade em 320px
Péssima em 320px: filtros de período e resumo são cortados (ACH-02, ACH-06). A tela não se adapta adequadamente a aparelhos de largura reduzida.

### (7) Elementos "feios", desalinhados, cortados ou tortos
- Último item do modal cortado (ACH-01) — elemento cortado.
- Linhas de detalhe da OS truncadas (ACH-04) — texto cortado/transbordando.
- Filtros de período cortados em 320px (ACH-02, ACH-06) — elementos cortados.
- Nenhum elemento claramente "torto" ou desalinhado grosseiramente foi observado; o layout é limpo e alinhado.

---

## 5. Lista Priorizada do que Corrigir Primeiro

### Prioridade 1 — Crítico (bloqueia uso)
1. **ACH-01** — Corrigir corte do último item no modal de seleção de cliente (09-modal-selecao.png). Aumentar área rolável e padding inferior do modal.
2. **ACH-02 / ACH-06** — Corrigir corte dos botões de filtro de período e resumo em 320px (12-historico-320px.png). Adicionar wrap/scroll horizontal e reduzir tamanho do texto para caber em telas pequenas.

### Prioridade 2 — Alto (prejudica acessibilidade do público-alvo)
3. **ACH-03** — Aumentar tamanho e contraste do texto de rodapé no login (01-login.png).
4. **ACH-04** — Corrigir truncamento de linhas de detalhe na OS (06-detalhe-os.png).
5. **ACH-05** — Aplicar estilo visual claro de "desabilitado" no campo Veículo da Nova OS (08-nova-os.png).

### Prioridade 3 — Médio (melhora usabilidade e consistência)
6. **ACH-07** — Adicionar rótulo ao botão "cc" no painel (02-painel.png).
7. **ACH-08** — Aumentar fonte e contraste de telefones/CPFs na lista de clientes (03-clientes.png).
8. **ACH-11** — Aumentar ícones e adicionar rótulos de texto em todas as posições da barra inferior (todas as telas).
9. **ACH-09** — Aumentar padding direito e área de toque da seta do card de veículo (04-cliente-veiculos.png).
10. **ACH-10** — Aumentar pílulas de status na lista de ordens (05-ordens.png).
11. **ACH-12** — Reforçar visualmente o ícone "Sair" no menu (10-menu.png).

### Prioridade 4 — Baixo (polimento)
12. **ACH-13** a **ACH-21** — Aumentar tamanho da fonte de textos auxiliares pequenos (botão "Ver", "Toque para filtrar", "Buscar CPF", links secundários, placeholders, metadados, subtítulos e resumos).

---

## 6. Metodologia e Limitações

- A avaliação baseou-se exclusivamente nas 12 capturas de tela fornecidas, sem acesso ao código-fonte, componentes ou testes automatizados.
- Não foram executados testes de contraste automatizados nem de leitor de tela; as classificações de contraste são estimativas visuais.
- A classificação de severidade considera o impacto no público-alvo (senhor de 48 anos) e se o problema impede ou apenas dificulta o uso.
- Nenhum arquivo do repositório foi modificado, conforme solicitado.

---

**Arquivos de suporte criados em `memoria/`:**
- `memoria/ESTADO-ATUAL.md`
- `memoria/PROXIMO-PASSO.md`
- `memoria/HISTORICO-DE-EXECUCAO.md`

**Relatório entregue em:** `RELATORIO-AUDITORIA-UI-UX.md`
