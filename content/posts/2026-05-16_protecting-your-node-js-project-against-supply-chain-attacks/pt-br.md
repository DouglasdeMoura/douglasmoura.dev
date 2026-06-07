---
title: "Protegendo seu projeto Node.js contra ataques de supply chain"
slug: protegendo-seu-projeto-node-js-contra-ataques-de-supply-chain
locale: pt-BR
created: 2026-05-16 18:08:25.866Z
updated: 2026-06-07 02:19:14.000Z
cover: ./cover.png
tags:
  - Node.js
  - npm
  - TypeScript
---
Vários incidentes recentes de supply chain atingiram pacotes npm bastante usados. O [comprometimento do TanStack](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem), por exemplo, afetou 42 pacotes e 84 versões publicadas em maio de 2026. Algumas semanas antes, o [comprometimento do Axios](https://www.microsoft.com/en-us/security/blog/2026/04/01/mitigating-the-axios-npm-supply-chain-compromise/) publicou as versões maliciosas `axios@1.14.1` e `axios@0.30.4`.

Muitas versões maliciosas são detectadas e removidas em poucas horas. Atrasar a resolução das dependências dá tempo para o ecossistema identificar versões ruins antes que o seu projeto as instale. Não é uma defesa completa, mas é uma configuração pequena com um bom retorno.

npm 11.10+, Yarn 4.10+ e pnpm 10.16+ têm suporte a bloqueios por idade mínima de release. O pnpm 11 também define um cooldown de 24 horas por padrão.

## npm

No npm, a configuração se chama `min-release-age`, e o valor é em dias:

```bash
npm config set min-release-age=1 --location=project
```

Isso escreve `min-release-age=1` no `.npmrc` do projeto. Você também pode usar `--location=user` ou `--location=global` para escrever na configuração de usuário ou global do npm.

## Yarn (Berry 4.10+)

No Yarn, a configuração se chama `npmMinimalAgeGate`. No Yarn 4.10, use minutos:

```bash
yarn config set npmMinimalAgeGate 1440
```

Isso escreve `npmMinimalAgeGate: 1440` no `.yarnrc.yml` do projeto. Adicione `--home` para escrever em `~/.yarnrc.yml`.

Versões atuais do Yarn também aceitam strings de duração, então o comando abaixo é equivalente:

```bash
yarn config set npmMinimalAgeGate 1d
```

## pnpm

No pnpm, a configuração se chama `minimumReleaseAge`, e o valor é em minutos:

```bash
pnpm config set --location=project minimumReleaseAge 1440
```

Isso escreve `minimumReleaseAge: 1440` no `pnpm-workspace.yaml`. Use `--location=global` se quiser escrever na configuração global do pnpm.

Se você já usa pnpm 11, esse é o padrão. Ainda assim, definir isso explicitamente pode ser útil porque documenta a política no repositório e mantém instalações com pnpm 10.16+ protegidas.

## Uma nota para quem usa Dependabot ou Renovate

As configurações dos gerenciadores de pacotes acima são aplicadas quando as dependências são instaladas ou resolvidas. Bots de atualização de dependências tomam as próprias decisões antes desse ponto, então configure-os também.

No Dependabot, use `cooldown` no `dependabot.yml`:

```yaml
cooldown:
  default-days: 1
```

Cooldowns do Dependabot valem para atualizações de versão, não para atualizações de segurança.

No Renovate, configure `minimumReleaseAge`:

```json
{
  "minimumReleaseAge": "1 day"
}
```

O Renovate também ignora `minimumReleaseAge` para atualizações de segurança.

## Uma palavra de cautela

Continue *commitando* o seu lockfile e use instalações determinísticas no CI, como `npm ci`, `pnpm install --frozen-lockfile` ou `yarn install --immutable`. Um bloqueio por idade mínima de release reduz a chance de puxar uma versão maliciosa recém-publicada, mas ele não limpa um lockfile comprometido nem torna segura uma versão ruim já instalada.

## Indo além com o Aube

O [Aube](https://aube.en.dev/) é um novo gerenciador de pacotes que traz várias dessas proteções ativadas por padrão: idade mínima de release de 24 horas, scripts de ciclo de vida bloqueados por padrão, detecção de typosquat e builds isoladas opcionais para dependências aprovadas. Eu escrevi sobre ele [neste artigo](/aube-uma-nova-aurora-para-instalacoes-node).
