---
title: "chroncal dois meses depois: contas CalDAV, robustez de sincronização e o que vem a seguir"
slug: chroncal-dois-meses-depois
locale: pt-BR
created: 2026-08-21 17:39:53.000Z
updated: 2026-08-21 17:50:39.000Z
cover: ./cover.png
tags:
  - CLI
  - Calendar
  - SQLite
---
Quando [apresentei o chroncal](https://douglasmoura.dev/apresentando-chroncal) em meados de junho, ele estava na v0.3.x. Pouco mais de dois meses depois ele está na v0.7.12 — vinte e quatro releases no meio do caminho, o maior release de funcionalidades até agora, uma enorme passada de robustez e os primeiros relatos de bugs de pessoas que não sou eu. Quatro dessas cinco issues da comunidade já estão corrigidas e publicadas. Este post é um apanhado do que mudou e para onde o projeto vai.

## Contas CalDAV

A grande novidade da v0.7.0: contas agora são um conceito de primeira classe. Até então, cada calendário remoto carregava sua própria URL e sua própria cópia de uma credencial — conectar dez calendários do Nextcloud significava dez logins. Uma *conta* armazena uma credencial, descobre todas as coleções que o servidor expõe e passa a ser dona dos calendários que vêm dela:

```bash
CHRONCAL_PASSWORD="…" chroncal account add "Servidor do trabalho" \
    --server https://cal.example.com --username alice

chroncal account calendars list "Servidor do trabalho"   # inventário completo, atualizado
chroncal account calendars add "Servidor do trabalho" --all
```

O `account add` importa toda coleção que suporte `VEVENT`, `VTODO` ou `VJOURNAL` e completa uma sincronização inicial antes de retornar. O `account remove` apaga a credencial e os vínculos remotos, mas mantém os calendários baixados como cópias locais. Segredos são lidos de `CHRONCAL_PASSWORD`, `CHRONCAL_BEARER_TOKEN` ou `GOOGLE_CLIENT_SECRET`, ou pedidos via prompt interativo — nunca aceitos como flag de CLI.

O Google Calendar saiu ganhando: a descoberta agora lê a CalendarList do Google, então calendários delegados, de família, de feriados e de assinatura passam a ser encontrados — não só o primário — atrás de um único login. E as credenciais agora têm escopo por banco de dados no chaveiro do sistema operacional, então dois bancos do chroncal na mesma máquina não colidem mais.

Atualizar não exige ação: as migrações `040`–`042` são aditivas, vínculos por calendário via `--remote-url` continuam funcionando e nenhum comando foi removido ou renomeado.

## Um gerenciador de calendários unificado na TUI

Pressione `C` (ou procure na paleta de comandos) e você tem o novo gerenciador de calendários: uma hierarquia agrupada por conta à esquerda, um inspetor à direita e edição de metadados inline. Um menu **+ Add** na base oferece **New Calendar…**, **Add Account…** (OAuth completo no navegador, sem sair do aplicativo) e **Import Calendar File…**. O **Manage Calendars…** mostra as coleções descobertas como uma lista de verificação — desmarcar uma remove a cópia local após confirmação, nunca a remota.

A barra lateral também se reorganizou em torno de contas: seções discretas e recolhíveis com um grupo **Local** separado, círculos preenchidos `●` e vazados `○` para alternar visibilidade, e `Shift+↑`/`Shift+↓` para reordenar seções inteiras de contas. Calendários locais ganharam **Move to Account…** para transferir seu conteúdo para uma coleção remota. E coleções que o servidor expõe como somente leitura agora são utilizáveis: navegação local e sincronização apenas de download, com edições rejeitadas em vez de silenciosamente perdidas.

## Robustez do núcleo

A v0.6.0 foi um único release com mais de 200 correções de bugs, e ele mostra onde está o trabalho real de uma ferramenta de calendário:

- **Correção na sincronização**: ETags fracos tratados como fracos, exclusões de tombstones condicionais, resolução de conflitos atômica, fim dos objetos duplicados após conflitos no modo prompt
- **Alarmes**: claims de snooze e refire para checadores sobrepostos nunca dispararem duas vezes, ancoragem por ocorrência no `DUE` de alarmes de tarefas recorrentes
- **Fidelidade iCal**: horários *floating* exportados como UTC wall clock, abas de `VTIMEZONE` ampliadas para o horizonte da série recorrente, `TZID` emitido em `EXDATE`/`RDATE`
- **Recorrência**: eventos só com RDATE, `EXDATE`s distorcidos por fuso, instâncias de vários dias cruzando o limite de uma janela
- **A TUI**: truncamento consciente da largura de exibição em toda parte, para que títulos com CJK e emojis deixem de quebrar o grid

A v0.7.1 complementou exibindo os avisos de importação em vez de descartá-los — eles agora aparecem na linha de status e num arquivo de log, com o registro dono nomeado. No desempenho, contas distintas sincronizam em paralelo enquanto calendários de uma mesma conta seguem em série, e as buscas de sobreposições recorrentes são agrupadas por mestre.

## Adições menores

- `chroncal --event <id|uid>` abre a TUI focada num evento (v0.7.7)
- `chroncal event rsvp 42 --status ACCEPTED` define seu status de RSVP pela CLI, com apelidos `yes`/`no`/`maybe` (v0.7.5)
- Excluir **esta ocorrência** ou **esta e as seguintes** de uma série (v0.7.4)
- `p` copia os detalhes do evento na visualização de evento (v0.7.8)
- `W` alterna o primeiro dia da semana entre domingo e segunda, persistido como a escolha de visão e configurável via `ui.week_start` (v0.7.11)
- `account credentials` e `account reauth` rotacionam segredos basic/bearer e repetem o fluxo OAuth do Google; calendários podem ser ocultados e exibidos, e a sincronização pode rodar para uma única conta (v0.7.8)

## Da comunidade

A parte que mais me deixava curioso: como seriam as primeiras issues de desconhecidos? Cinco issues, quatro pessoas, e a resposta acabou sendo as peculiaridades do CalDAV do Google Calendar.

[**#575**](https://github.com/DouglasdeMoura/chroncal/issues/575) — @dmitrydoni descobriu que o Google entrega `VALARM` com `ACTION:NONE`, que o schema do chroncal (`CHECK action IN ('AUDIO','DISPLAY','EMAIL')`) rejeitava, revertendo a transação do recurso inteiro e impedindo a convergência da sincronização inicial. A v0.7.8 agora preserva alarmes estranhos por completo, conta-os nos avisos, e o `--clear-foreign-alarms` os remove.

[**#576**](https://github.com/DouglasdeMoura/chroncal/issues/576) — o mesmo repórter esbarrou no Google devolvendo hrefs de recursos desatualizados que dão `404` no multiget; cada falha contava como incompleta e o token de sincronização era retido para sempre. A v0.7.9 converge apesar dos 404s desatualizados. A issue foi fechada e a correção publicada cerca de quinze minutos depois.

[**#629**](https://github.com/DouglasdeMoura/chroncal/issues/629) — @Six-VI, que gentilmente chamou o chroncal de "by far the best terminal calendar I have come across" (de longe o melhor calendário de terminal que já encontrei), pediu uma forma de começar a semana na segunda. Saiu na v0.7.11 como o alternador `W`, também de issue fechada a release em quinze minutos.

[**#628**](https://github.com/DouglasdeMoura/chroncal/issues/628) — @maxandersen relatou que o Google responde `403` ao PROPFIND não padronizado de `calendar-color`, o que abortava a sincronização inicial depois da conta já criada. A v0.7.12 (publicada no dia seguinte) mantém a sincronização de eventos rodando quando a busca da cor falha e envia as cores pela API CalendarList.

[**#627**](https://github.com/DouglasdeMoura/chroncal/issues/627) — @teto pediu um módulo do [home-manager](https://github.com/nix-community/home-manager) para Nix, exposto pelo flake como o khal faz. Ainda aberta, e um pedido justo dado que o projeto já publica um flake — saber que a importação do Fastmail funcionou sem ajustes foi um bônus agradável de ler.

O repositório também cruzou 60 estrelas nesse meio-tempo. Para uma ferramenta que promete conformidade com o RFC 5545, ver estranhos testando-a contra servidores CalDAV do mundo real é exatamente o ciclo de feedback que eu esperava.

## O que vem a seguir

A lista que dei em junho continua de pé, e o progresso nela é honesto, se não rápido:

- **Tarefas e diários na TUI** ([#30](https://github.com/DouglasdeMoura/chroncal/issues/30)) — a maior lacuna restante e o próximo grande foco. O lado da CLI está completo; a TUI ainda trata `VTODO` e `VJOURNAL` como cidadãos de segunda classe.
- **Pacotes `.deb` e `.rpm`** via GoReleaser nFPM, quando os canais primários de gerenciadores de pacotes estiverem estáveis.
- **O módulo do home-manager** da #627.
- **Casos-limite de sincronização da minha própria lista**: o push oportunista hoje fixa em server-wins e pode descartar uma edição local concorrente ([#610](https://github.com/DouglasdeMoura/chroncal/issues/610)), além de acompanhamentos sobre token de sincronização e calendar-color do Google ([#625](https://github.com/DouglasdeMoura/chroncal/issues/625), [#634](https://github.com/DouglasdeMoura/chroncal/issues/634)).
- **Um arcabouço de testes com banco de dados para a TUI**, para que a cadeia edição-salvamento tenha cobertura de regressão ([#601](https://github.com/DouglasdeMoura/chroncal/issues/601)).

Se você experimentou o chroncal em junho, atualize e reconecte via `chroncal account add` — um único login para o servidor inteiro supera colar URLs por calendário. Se ainda não experimentou, o repositório está em [github.com/DouglasdeMoura/chroncal](https://github.com/DouglasdeMoura/chroncal), e issues e contribuições continuam sendo bem-vindas.
