---
title: "Apresentando o Chroncal Bar: seu calendário na barra de menus do Omarchy"
slug: apresentando-chroncal-bar
locale: pt-BR
created: 2026-08-21 18:01:01.000Z
updated: 2026-08-21 18:16:30.000Z
cover: ./cover.png
tags:
  - CLI
  - Calendar
  - Omarchy
---
Dois meses depois de [lançar o chroncal](https://douglasmoura.dev/apresentando-chroncal), meu gerenciador de calendário com foco no terminal, uma lacuna continuava me incomodando: a resposta para "qual é a minha próxima reunião?" exigia abrir um terminal. Se você usa [Omarchy](https://omarchy.org/), a barra de menus está sempre na tela — então é ali que o calendário deveria viver. Hoje estou lançando o [Chroncal Bar](https://github.com/DouglasdeMoura/chroncal-bar), um widget de barra para o Omarchy Quattro movido a chroncal. Ele mostra o evento atual ou o próximo num relance e abre num painel de agenda completo, capaz de criar, editar, excluir e responder eventos sem sair da barra.

É escrito em QML, rodando dentro do host Quickshell do Omarchy, e trata o chroncal como a única fonte de verdade: todos os dados fluem pela CLI do chroncal, nunca por fora.

## A barra

O widget em si é intencionalmente discreto:

- Mostra todos os eventos correntes que se sobrepõem, ou o próximo evento
- Rótulos relativos perto do evento (`in 5m`, `12m left`) e rótulos explícitos de dia da semana para os posteriores (`Mon 09:00`)
- As cores dos seus calendários do chroncal no rótulo, na agenda e no indicador de progresso
- Some completamente quando nenhum evento visível resta na janela configurada
- Clique esquerdo abre a agenda, clique do meio abre a URL do próximo evento, clique direito atualiza

Eventos de dia inteiro, sobrepostos, em andamento e futuros são todos tratados. Quando não há nada dentro da janela de visualização, a barra ocupa zero pixels — sem ícone parado, sem ruído.

## O painel de agenda

Clique esquerdo e o painel abre: eventos agrupados em Hoje, Amanhã e datas posteriores, com busca em títulos, descrições, locais, nomes de calendários e participantes. Selecionar um evento mostra data, local, notas, links de conferência, participantes com status de RSVP e o organizador, e URLs nas notas viram links clicáveis. Links do Google Meet abrem como a conta dona do calendário (`authuser`), e locais ganham um link de maps em um clique.

O painel não é somente leitura. Ele cria, edita e exclui eventos através do chroncal — campos omitidos são preservados na edição, horários inalterados nunca são reinterpretados e exclusões pedem confirmação. Eventos recorrentes recebem tratamento de verdade: o painel carrega a série inteira para ocorrências geradas, edita sobreposições armazenadas como apenas aquela sobreposição, e a exclusão oferece este evento, este e os seguintes, ou todos. Se o dono do calendário é um convidado, um controle Going responde Sim, Talvez ou Não — por trás está o `chroncal event rsvp`.

A linguagem do teclado espelha a TUI do chroncal:

| Tecla | Contexto | Ação |
| --- | --- | --- |
| `↑`/`↓`, `j`/`k` | Agenda | Mover seleção |
| `←`/`→`, `h`/`l` | Agenda | Dia anterior ou seguinte |
| `t` | Agenda | Ir ao primeiro evento de hoje |
| `/` | Agenda | Buscar |
| `c` / `e` / `x` | Agenda ou detalhes | Criar / editar / excluir |
| `v` | Detalhes do evento | Entrar ou abrir a URL do evento |
| `p` | Detalhes do evento | Copiar detalhes do evento |
| `g` | Detalhes do evento | Abrir este evento na TUI do chroncal |
| `y` / `n` / `m` | Detalhes do evento | RSVP sim, não, talvez |
| `C` ou `,` | Agenda | Abrir configurações |
| `Esc` ou `q` | Qualquer visão | Voltar ou fechar |

## Calendários e contas sem sair da barra

O painel de configurações inclui um gerenciador completo de calendários: contas agrupadas com seus calendários aninhados, criar e ocultar calendários, definir o padrão, e-mail do dono, sincronização por calendário e descoberta de coleções remotas. Você pode adicionar contas CalDAV — senha, bearer token ou Google OAuth — e importar arquivos iCal de dentro da barra. Uma conta com problemas de sincronização oferece o reset do estado de um calendário, e conflitos se resolvem com Manter local ou Manter servidor.

Uma distinção que vale conhecer: *calendários incluídos* filtram o que a barra mostra, enquanto *ocultar* é uma flag do chroncal — calendários ocultos mantêm seus eventos mas saem da agenda, e as configurações continuam listando-os para que possam voltar.

## Segredos continuam segredos

Senhas de contas, bearer tokens e client secrets de OAuth nunca são armazenados no arquivo de configurações do widget (`~/.config/omarchy/shell.json`) e nunca aparecem em `argv`, logs ou listagens de processos — eles são passados como ambiente de processo para o único comando do chroncal que precisa deles. É a mesma disciplina que o próprio chroncal segue, estendida à barra.

## Instalação

Requisitos: Omarchy Quattro, chroncal 0.7.4 ou mais novo no `PATH`, e a caixa de ferramentas Wayland de sempre (`bash`, `jq`, `date` GNU, `timeout` GNU, `wl-copy`, `notify-send`, `xdg-open`). O release mais recente do chroncal cobre tudo o que a barra usa, incluindo RSVP e configuração de contas:

```sh
mise use -g github:DouglasdeMoura/chroncal
```

Depois instale o plugin:

```sh
omarchy plugin add https://github.com/DouglasdeMoura/chroncal-bar.git --enable
omarchy bar move douglasdemoura.chroncal-bar --section right --after omarchy.tray
```

O segundo comando é opcional — ele posiciona o widget ao lado do tray no grupo alinhado à direita da barra.

## Configuração

Abra a agenda e pressione `C`, ou clique na engrenagem de configurações. Você tem dias à frente (1–30), intervalo de atualização, tamanho máximo do título na barra, a janela de contagem relativa, calendários incluídos, filtros de dia inteiro e sem participantes, e eventos sem local ou link de reunião. As configurações persistem na entrada do widget em `~/.config/omarchy/shell.json` e também podem ser definidas pela linha de comando:

```sh
omarchy bar set douglasdemoura.chroncal-bar interval 60
omarchy bar set douglasdemoura.chroncal-bar lookaheadDays 7
```

## Como ele roda

O plugin roda dentro do processo Quickshell de longa duração do Omarchy, com as permissões do seu usuário. Um timer em QML inicia um auxiliar de agenda de disparo único no intervalo configurado; o auxiliar emite um documento JSON normalizado e encerra. O plugin não cria outro processo Quickshell, não instala pacotes, não pede privilégios elevados e não roda instaladores remotos. O chroncal continua sendo a fonte de verdade — a barra chama a CLI para ler dados e executar ações explicitamente pedidas, e o serviço opcional em segundo plano do chroncal permanece totalmente separado.

Isto é, deliberadamente, paridade de barra de menus, não um substituto da TUI. Mudanças de horário sensíveis a fuso, alarmes, livre/ocupado e o serviço de sincronização permanecem no chroncal — e o `g` no painel salta direto de qualquer evento para a TUI completa.

O repositório está em [github.com/DouglasdeMoura/chroncal-bar](https://github.com/DouglasdeMoura/chroncal-bar), licenciado sob a MIT, com templates de issue e testes (testes de modelo em QML mais testes de agenda em shell). Se você usa Omarchy e chroncal, dois comandos colocam a próxima reunião na sua barra. Issues e contribuições são bem-vindas.
