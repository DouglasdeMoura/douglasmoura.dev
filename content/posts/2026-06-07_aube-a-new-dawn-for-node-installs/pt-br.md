---
title: "Aube: Uma Nova Aurora para Instalações Node"
slug: aube-uma-nova-aurora-para-instalacoes-node
locale: pt-BR
created: 2026-06-07 01:14:58.192Z
updated: 2026-06-07 02:02:46.000Z
cover: ./cover.webp
tags:
  - Node.js
  - npm
  - Gerenciador de Pacotes
  - TypeScript
---

[Aube](https://aube.en.dev/) (pronuncia-se "ohb", do francês para aurora) é um novo gerenciador de pacotes Node.js escrito em Rust por [en.dev](https://github.com/endevco), o mesmo desenvolvedor por trás do [Mise](https://douglasmoura.dev/managing-your-development-environment-with-mise). Ele lê e escreve seu lockfile existente (`pnpm-lock.yaml`, `package-lock.json`, `npm-shrinkwrap.json`, `yarn.lock` ou `bun.lock`) no mesmo local, então você pode experimentá-lo em um projeto sem obrigar seu time a trocar de gerenciador de pacotes. Comecei a usá-lo esta semana e quero compartilhar minhas impressões sobre a ferramenta.

## Velocidade

Aube parte do modelo de symlinks isolados do pnpm: os arquivos dos pacotes ficam em um armazenamento global endereçável por conteúdo, e os projetos se vinculam a eles por meio de um layout isolado de `node_modules`. O Aube também ativa por padrão seu armazenamento virtual global para instalações locais, enquanto o pnpm deixa esse recurso comparável desativado por padrão. Os resultados aparecem nos benchmarks atuais contra um projeto real com ~1400 pacotes:

| Cenário | aube | bun | deno | pnpm | npm | yarn |
|---|---|---|---|---|---|---|
| Instalação do zero (cache quente) | 272 ms | 2,00 s | 1,33 s | 2,34 s | 7,14 s | 8,86 s |
| Instalação do zero (cache frio) | 7,95 s | 5,78 s | 8,15 s | 15,87 s | 9,51 s | 13,19 s |
| `install && test` (já instalado) | 9 ms | 41 ms | 84 ms | 335 ms | 745 ms | 1,18 s |

O número com cache frio ainda fica atrás do Bun, mas os números com cache quente e comandos repetidos são onde o aube se destaca. A linha `install && test` representa o loop de desenvolvimento: o aube consegue pular o trabalho de instalação quando seu arquivo de estado está atualizado, então execuções repetidas de `aubr test` caem para tempos de dígito único em milissegundos.

## Compatibilidade de lockfile

Essa é a parte que chamou minha atenção. O Aube não introduz seu próprio formato de lockfile a menos que você queira. Se o seu projeto já tem `pnpm-lock.yaml`, o aube lê e escreve de volta no mesmo arquivo. O mesmo vale para `package-lock.json`, `npm-shrinkwrap.json`, `yarn.lock` e `bun.lock`. Isso significa que você pode executar `aubr test` em um projeto pnpm hoje e seus colegas que usam pnpm não notarão diferença.

| Lockfile | Lê | Escreve no local |
|---|---|---|
| `aube-lock.yaml` | sim | sim |
| `pnpm-lock.yaml` v9 | sim | sim |
| `package-lock.json` v2/v3 | sim | sim |
| `npm-shrinkwrap.json` | sim | sim |
| `yarn.lock` (v1 classic + v2+ berry) | sim | sim |
| `bun.lock` | sim | sim |

Para um novo projeto sem lockfile, o aube cria `aube-lock.yaml`.

## `aubr` e `aubx`

`aubr` é uma abreviação de `aube run`. Antes de executar um script, ele verifica se `node_modules` está atualizado em relação ao `package.json` e ao lockfile atuais. Se as dependências estiverem ausentes ou desatualizadas, ele as instala primeiro; caso contrário, pula direto para o script:

```bash
aubr test
aubr build
```

`aubx` é uma abreviação de `aube dlx`. Ele prefere um binário local já instalado antes de buscar em um ambiente descartável. Útil para ferramentas pontuais:

```bash
aubx cowsay hi
```

Ambos são shims multicall que compartilham o mesmo binário que `aube` e fazem dispatch com base em `argv[0]`. Toda flag que funciona no comando completo também funciona no shim.

## Menos uso de disco

Como o pnpm, o aube mantém os arquivos dos pacotes em um armazenamento global endereçável por conteúdo (`~/.local/share/aube/store/`) e vincula os projetos a ele. Três aplicações que dependem de React, Vite, TypeScript e Playwright compartilham os arquivos pesados em vez de armazenar três cópias completas. O Aube afirma até 90% menos uso de disco em comparação com a abordagem do npm de copiar dependências em cada projeto.

## Padrões de segurança

O Aube vem com diversas proteções da cadeia de suprimentos ativadas por padrão:

- **Política de confiança** (`trustPolicy: no-downgrade`): bloqueia a instalação de uma versão que apresenta evidências de confiança mais fracas do que qualquer versão publicada anteriormente do mesmo pacote. Um rebaixamento de confiança pode indicar takeover de conta, adulteração do repositório ou um co-mantenedor malicioso.
- **Idade mínima de lançamento**: período de espera de 24 horas para versões recém-publicadas por padrão (`minimumReleaseAge: 1440`). Captura ataques de typo-squat e confusão de dependências que são despublicados em questão de horas.
- **Scripts de ciclo de vida negados por padrão**: scripts de ciclo de vida de dependências (`preinstall`, `install`, `postinstall`) não são executados a menos que você os aprove explicitamente via `aube approve-builds`. Uma inspeção de conteúdo de scripts suspeitos alerta sobre padrões perigosos conhecidos como `curl | sh`, decodificação base64 seguida de avaliação, e leitura de arquivos de credenciais.
- **Builds confinadas opcionais**: quando `jailBuilds: true` está ativado e uma dependência é aprovada para build, o aube pode encapsular o script com um perfil Seatbelt (macOS), Landlock e seccomp (Linux), ou um ambiente limpo (Windows) para negar acesso à rede e limitar escritas no sistema de arquivos. Isso está incluído em `paranoid: true`, mas não é o padrão atual.
- **Proteção contra typosquat**: `aube add` verifica o pacote que você adiciona e o grafo de dependências transitivas resolvido contra o OSV quanto a avisos de pacotes maliciosos `MAL-*`, e solicita confirmação quando um pacote público tem uma contagem de downloads baixa.
- **Bloqueio de dependências transitivas exóticas**: rejeita dependências transitivas que resolvem para URLs `git+`, `file:` ou tarballs diretos, que ignoram o registro e sua verificação de integridade.

Existe um interruptor `paranoid: true` que agrupa todas as configurações restritas de uma vez:

```yaml
# aube-workspace.yaml
paranoid: true
allowBuilds:
  esbuild: true
  sharp: true
```

Isso força builds confinadas, política de confiança sem rebaixamento, restrição rigorosa de idade de lançamento, integridade estrita do armazenamento, revisão rigorosa de builds de dependências e verificações obrigatórias de avisos.

## Primeiros passos

O caminho de instalação recomendado é via [Mise](https://mise.en.dev/):

```bash
mise use -g aube
```

Também está disponível via Homebrew (`brew install endevco/tap/aube`) e npm (`npm install -g --ignore-scripts=false @endevco/aube`).

Dentro de um projeto Node.js existente, basta executar:

```bash
aubr test
```

O Aube instalará as dependências se necessário e então executará o script. Sem etapa de migração, sem conversão de lockfile.

## Comandos do dia a dia

```bash
aube add react          # adicionar uma dependência
aube add -D vitest      # adicionar uma dependência de desenvolvimento
aube remove react       # remover uma dependência
aube update             # atualizar dentro dos ranges do package.json
aubr build              # executar um script, instalando automaticamente se necessário
aube test               # executar testes, instalando automaticamente se necessário
aubx cowsay hi          # executar uma ferramenta pontual
aube install            # instalar apenas (setup, Docker, CI)
aube ci                 # instalação limpa e congelada para CI
```

Você também pode executar scripts diretamente:

```bash
aube dev
aube build
aube lint
```

Se o script existe em `package.json`, o aube trata isso como `aube run <script>`.

## Auditoria

O Aube possui um comando de auditoria integrado que usa a mesma fonte de dados de avisos que `npm audit` e `pnpm audit`:

```bash
aube audit                  # listar CVEs conhecidos com severidade baixa+
aube audit --audit-level high
aube audit --fix            # escrever overrides no package.json para versões corrigidas
aube audit --json | jq      # legível por máquina para CI
```

## Quando usar

O Aube vale a pena experimentar se você quer instalações mais rápidas sem mudar o fluxo de trabalho do seu time. A compatibilidade de lockfile significa que você pode usá-lo localmente enquanto seu CI e colegas continuam com pnpm, npm ou Yarn. Os padrões de segurança são os mais agressivos que já vi em qualquer gerenciador de pacotes Node.js, e `paranoid: true` adiciona um confinamento de scripts de ciclo de vida quando você quer o pacote mais restrito.

O projeto é jovem (v1.x, licenciado sob MIT, [no GitHub](https://github.com/endevco/aube)) mas avançando rápido. Se você já usa Mise, a instalação está a um comando de distância.
