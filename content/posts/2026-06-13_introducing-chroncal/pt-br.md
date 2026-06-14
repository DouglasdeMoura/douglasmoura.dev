---
title: "Apresentando o chroncal: um gerenciador de calendário, tarefas e diário com foco no terminal"
slug: apresentando-chroncal
locale: pt-BR
created: 2026-06-13 22:18:09.746Z
updated: 2026-06-14 01:12:37.000Z
cover: ./cover-2.png
tags:
  - CLI
  - Calendar
  - SQLite
---
Venho construindo o [chroncal](https://github.com/DouglasdeMoura/chroncal) nos últimos meses e hoje estou abrindo o projeto. É um gerenciador de calendário, tarefas e diário para terminal, escrito em Go, com SQLite por trás, amplo suporte a importação/exportação de iCalendar (RFC 5545) e sincronização via CalDAV. Você tem uma TUI interativa para o uso no dia a dia e uma CLI completa para scripts e automação. Seus dados ficam em um único arquivo local, portátil e em conformidade com os padrões.

Esta é a ferramenta que eu queria para mim: algo que funcione como um `lazygit` para calendários, que trabalhe offline, que se comunique com servidores CalDAV (incluindo o Google Calendar) e que não atrapalhe quando eu só quero conferir a próxima reunião.

## O que ele faz

O chroncal cobre três tipos de recursos que normalmente vivem em aplicativos separados:

- **Eventos** (VEVENT): agendamento com recorrência, fusos horários, participantes, alarmes e anexos
- **Tarefas** (VTODO): gerenciamento de tarefas com prazos, prioridade, acompanhamento de progresso e recorrência
- **Diários** (VJOURNAL): anotações diárias e entradas de diário com suporte a recorrência

Os três suportam criar, ler, atualizar, excluir, buscar e importar/exportar em iCal. Os três sincronizam via CalDAV. *Soft delete* e restauração são implementadas por padrão, para nada ser perdido acidentalmente.

## A TUI

Execute `chroncal` sem argumentos e você terá uma interface de terminal interativa com visões de mês, semana, dia e agenda. Alterne as visões com `m`, `w`, `d`, `a`. Os calendários ficam em uma barra lateral com código de cores. Você pode criar, editar, visualizar e excluir eventos sem sair do teclado, e `u` desfaz uma exclusão.

A saúde da sincronização CalDAV fica visível num relance: um calendário cuja última sincronização falhou mostra um ícone de aviso na barra lateral, e abri-lo explica o que deu errado e oferece uma correção. Calendários remotos podem ser conectados e autenticados novamente diretamente pela TUI, incluindo o fluxo OAuth do Google.

A TUI vem com dois temas nativos. O `system` é o padrão e resolve suas cores de interface a partir da paleta ANSI de 16 cores do seu terminal, então configurações com temas como Catppuccin, Gruvbox, Tokyo Night ou Omarchy se estendem ao chroncal. Ele também adapta o destaque da linha selecionada à cor de fundo ativa do terminal quando o terminal a informa. O `default` usa uma paleta fixa clara/escura, desenhada por um designer, caso você prefira uma aparência consistente entre máquinas.

## A CLI

Toda operação disponível na TUI também está disponível como comando de CLI, e a CLI vai além: o gerenciamento completo de tarefas e diários vive aqui. Isso torna o chroncal programável de formas que aplicativos de calendário com interface gráfica não conseguem igualar.

```bash
# Criar um calendário
chroncal calendar create "Trabalho" --color "#3B82F6"

# Adicionar um evento
chroncal event add "Daily da equipe" --date 2026-04-01 --time 09:00 --duration 30m --calendar Trabalho

# Adicionar um evento recorrente
chroncal event add "Revisão semanal" --date 2026-04-04 --time 14:00 --duration 1h --rrule "FREQ=WEEKLY;BYDAY=FR"

# Adicionar uma tarefa
chroncal todo add "Escrever relatório trimestral" --due 2026-04-15 --priority 1

# Adicionar uma entrada de diário
chroncal journal add "Anotações da semana" --date 2026-04-04 --calendar Trabalho

# Listar eventos futuros
chroncal event list --from 2026-04-01 --to 2026-04-30

# Buscar
chroncal event search "daily"
```

### Saída em JSON para scripts e LLMs

Todo comando aceita `-o json` (ou `--output json`). O formato da saída é estável, comandos de escrita devolvem a nova linha para que você capture o `id` ou `uid`, e erros vão para a saída de erro (stderr), então fazer pipe com `jq` é sempre seguro.

```bash
# Ida e volta: criar e depois ler o novo evento
uid=$(chroncal event add "Demo" --date 2026-06-01 --time 09:00 --output json | jq -r .uid)
chroncal event get "$uid" --output json
```

Carimbos de data/hora no JSON estão em RFC 3339 UTC com sufixo `Z`, então comparações entre máquinas se mantêm honestas. Erros emitem um objeto JSON na saída de erro com um campo `code` (`not_found`, `invalid_input`, `aborted` ou `error`), para que você possa tratar programaticamente. Isso torna o chroncal fácil de acionar a partir de scripts de shell, pipelines de CI ou agentes de modelos de linguagem.

## Sincronização CalDAV

A sincronização é por calendário: cada calendário local pode ser vinculado a uma URL CalDAV remota. Não há um conceito separado de conta. Conecte um calendário no momento da criação:

```bash
chroncal calendar create "Trabalho" \
    --remote-url https://cal.example.com/dav/calendars/work/ \
    --username alice --auth basic
```

Depois sincronize e verifique o status:

```bash
chroncal sync run --calendar Trabalho
chroncal sync status
```

O chroncal foi testado contra o CalDAV do Nextcloud com ida e volta de VEVENT, VTODO, VJOURNAL e VALARM, incluindo recorrência, tratamento de fuso horário e resolução de conflitos. Conflitos podem ser resolvidos com `--pick {local,server}`, e a estratégia padrão é configurável.

### Google Calendar

O Google Calendar exige OAuth 2.0 e suporta apenas VEVENT sobre CalDAV. O chroncal cuida de todo o fluxo OAuth PKCE: você fornece um client ID e um secret de aplicativo Desktop (o secret é aceito via variável de ambiente ou prompt interativo, nunca como flag de CLI), autoriza uma vez no navegador e as sincronizações seguintes rodam de forma autônoma. Você também pode conectar e autenticar novamente calendários do Google diretamente pela TUI.

Um detalhe importante: você precisa ativar tanto a Calendar JSON API quanto a CalDAV API no seu projeto do Google Cloud. O endpoint CalDAV retorna `403 accessNotConfigured` até que `caldav.googleapis.com` esteja ativado, mesmo que a Calendar API já esteja ligada.

As credenciais são mantidas separadas do banco de dados de calendário. O SQLite armazena dados de calendário e metadados remotos, mas senhas, bearer tokens, refresh tokens de OAuth e client secrets do Google passam pelo chaveiro do sistema operacional por padrão. Se não houver um chaveiro disponível, o chroncal se recusa a armazenar segredos a menos que você passe explicitamente `--allow-plaintext`; esse fallback grava arquivos JSON com permissão `0600` no seu diretório de configuração do chroncal. É útil para servidores e contêineres, mas backups e ferramentas de sincronização ainda conseguem ler esses arquivos, então recomendo usar um chaveiro real em máquinas compartilhadas.

## Alarmes e notificações

Alarmes são cidadãos de primeira classe. Anexe-os ao criar ou atualizar eventos e tarefas com `--alarm`:

```bash
chroncal event add "Daily" --date 2026-06-15 --time 09:00 --alarm "-PT15M"
chroncal event add "Release" --date 2026-06-15 --time 14:00 --alarm "DISPLAY:-PT30M::3:PT5M"
```

A sintaxe de alarme mapeia para o `VALARM` do RFC 5545: `ACTION`, `TRIGGER`, `REPEAT`, `DURATION` e `RELATED`. Um `-PT15M` isolado é um gatilho de duração iCalendar padrão, significando 15 minutos antes de o evento ou tarefa começar. A forma mais longa existe para quando você precisa de alarmes repetidos ou de um alarme relativo ao fim em vez do início.

Alarmes DISPLAY mostram notificações de desktop, alarmes AUDIO tocam um som e alarmes EMAIL enviam mensagens por um servidor SMTP configurado. Para que os alarmes realmente disparem, execute `chroncal alarm daemon` em um loop em primeiro plano, ou instale um serviço em segundo plano com `chroncal service install` — que configura um timer do systemd no Linux, um agente do launchd no macOS ou uma Tarefa Agendada no Windows. O serviço instalado também executa a sincronização CalDAV num intervalo configurável (padrão de 15 minutos).

## Compatibilidade iCal

O chroncal busca conformidade total com o RFC 5545. A cobertura atual inclui VEVENT (30/31 propriedades), VTODO (31/32 propriedades), VJOURNAL, VALARM (7/7 propriedades mais suporte a UID do RFC 9074), cobertura completa dos parâmetros ATTENDEE/ORGANIZER, preservação de ida e volta de VTIMEZONE e cálculo local de VFREEBUSY mais consultas remotas via CalDAV.

Você pode importar do Google Calendar, Apple Calendar, Thunderbird ou qualquer fonte em conformidade com o RFC 5545, e a exportação produz arquivos `.ics` em conformidade com o padrão:

```bash
chroncal ical import calendar.ics --calendar Trabalho
chroncal ical export --calendar Trabalho -f trabalho.ics
```

## Consultas de livre/ocupado

Calcule o tempo ocupado a partir de dados locais recorrentes ou consulte um servidor CalDAV remoto:

```bash
chroncal freebusy --calendar Trabalho --from 2026-04-01 --to 2026-04-30
chroncal freebusy --calendar Trabalho --from 2026-04-01 --to 2026-04-30 --remote
```

## Instalação

O chroncal está disponível por oito canais de instalação cobrindo Linux, macOS e Windows:

| Método | Plataformas |
| --- | --- |
| Script de instalação | Linux, macOS, FreeBSD, OpenBSD |
| Homebrew | macOS, Linux |
| Go install | Qualquer plataforma com Go 1.25+ |
| mise | macOS, Linux |
| Nix | Linux, macOS |
| Scoop | Windows |
| AUR | Arch Linux |
| Compilar do código-fonte | Qualquer plataforma com Go 1.25+ |

O caminho mais rápido no Linux ou macOS:

```bash
curl -fsSL https://raw.githubusercontent.com/DouglasdeMoura/chroncal/master/scripts/install.sh | sh
```

Ou com Homebrew:

```bash
brew tap douglasdemoura/tap && brew install chroncal
```

No Windows, o caminho de instalação gerenciado é o Scoop:

```powershell
scoop bucket add chroncal https://github.com/DouglasdeMoura/scoop-bucket
scoop install chroncal
```

Ou se você usa o [mise](https://douglasmoura.dev/managing-your-development-environment-with-mise):

```bash
mise use -g github:DouglasdeMoura/chroncal
```

O chroncal também tem um ícone de aplicativo personalizado para os lançadores:

<p align="center">
  <img src="./img/chroncal-icon.png" alt="ícone do aplicativo chroncal" width="160" />
</p>

Se você usa o [Omarchy](https://omarchy.org/), pode adicionar o chroncal ao menu de aplicativos com um comando:

```bash
omarchy tui install chroncal chroncal float https://raw.githubusercontent.com/DouglasdeMoura/chroncal/master/assets/chroncal-512.png
```

Isso cria um item de lançador que abre o chroncal no seu terminal configurado. O estilo `float` abre numa janela flutuante centralizada; use `tile` se quiser que ele se comporte como uma janela normal no mosaico (tiling).

## Armazenamento de dados

O banco de dados é um único arquivo SQLite com modo WAL ativado para concorrência. As migrações rodam automaticamente na inicialização. Locais padrão:

- **Linux**: `~/.local/share/chroncal/chroncal.db`
- **macOS**: `~/Library/Application Support/chroncal/chroncal.db`

Sobrescreva com `CHRONCAL_DB` ou a chave `db` no `config.toml`. Por ser um único arquivo, fazer backup ou mover os dados do seu calendário é uma cópia de arquivo.

## O que vem a seguir

O chroncal está na v0.3.x e é licenciado sob a MIT. O conjunto principal de funcionalidades (eventos, tarefas, diários, sincronização CalDAV, alarmes, importação/exportação iCal, busca em texto completo e regras de recorrência) está funcionando e testado. O gerenciamento de tarefas e diários na TUI é o próximo grande foco, junto com pacotes `.deb` e `.rpm`.

Se você vive no terminal e quer seus dados de calendário locais, portáteis e programáveis, experimente. O repositório está em [github.com/DouglasdeMoura/chroncal](https://github.com/DouglasdeMoura/chroncal), e issues e contribuições são bem-vindas.
