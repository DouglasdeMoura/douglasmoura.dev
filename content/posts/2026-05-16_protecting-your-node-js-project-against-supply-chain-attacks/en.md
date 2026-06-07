---
title: "Protecting your Node.js project against supply-chain attacks"
slug: protecting-your-node-js-project-against-supply-chain-attacks
locale: en-US
created: 2026-05-16 18:08:25.866Z
updated: 2026-06-07 02:19:14.000Z
cover: ./cover.png
tags:
  - Node.js
  - npm
  - TypeScript
---
Several recent supply-chain incidents have hit widely used npm packages. The [TanStack compromise](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem), for example, affected 42 packages and 84 published versions in May 2026. A few weeks earlier, the [Axios compromise](https://www.microsoft.com/en-us/security/blog/2026/04/01/mitigating-the-axios-npm-supply-chain-compromise/) published malicious `axios@1.14.1` and `axios@0.30.4` releases.

Many malicious releases are detected and removed within hours. Delaying dependency resolution gives the ecosystem time to catch bad versions before your project installs them. It is not a complete defense, but it is a small setting with a good payoff.

npm 11.10+, Yarn 4.10+, and pnpm 10.16+ support release-age gates. pnpm 11 also sets a 24-hour cooldown by default.

## npm

npm calls the setting `min-release-age`, and the value is in days:

```bash
npm config set min-release-age=1 --location=project
```

This writes `min-release-age=1` to the project's `.npmrc`. You can also use `--location=user` or `--location=global` to write to your user or global npm configuration.

## Yarn (Berry 4.10+)

Yarn calls the setting `npmMinimalAgeGate`. In Yarn 4.10, use minutes:

```bash
yarn config set npmMinimalAgeGate 1440
```

This writes `npmMinimalAgeGate: 1440` to the project's `.yarnrc.yml`. Add `--home` to write to `~/.yarnrc.yml` instead.

Current Yarn versions also accept duration strings, so this is equivalent:

```bash
yarn config set npmMinimalAgeGate 1d
```

## pnpm

pnpm calls the setting `minimumReleaseAge`, and the value is in minutes:

```bash
pnpm config set --location=project minimumReleaseAge 1440
```

This writes `minimumReleaseAge: 1440` to `pnpm-workspace.yaml`. Use `--location=global` if you want to write to the global pnpm configuration instead.

If you are already on pnpm 11, this is the default. Setting it explicitly can still be useful because it documents the policy in the repository and keeps older pnpm 10.16+ installs protected.

## A note for Dependabot and Renovate users

The package-manager settings above are enforced when dependencies are installed or resolved. Dependency update bots make their own decisions before that point, so configure them too.

For Dependabot, use `cooldown` in `dependabot.yml`:

```yaml
cooldown:
  default-days: 1
```

Dependabot cooldowns apply to version updates, not security updates.

For Renovate, set `minimumReleaseAge`:

```json
{
  "minimumReleaseAge": "1 day"
}
```

Renovate also bypasses `minimumReleaseAge` for security updates.

## A word of caution

Keep committing your lockfile and use deterministic installs in CI, such as `npm ci`, `pnpm install --frozen-lockfile`, or `yarn install --immutable`. A release-age gate reduces the chance of pulling a brand-new malicious version, but it will not clean up a compromised lockfile or make an already-installed bad version safe.

## Going further with Aube

[Aube](https://aube.en.dev/) is a new package manager that ships with several of these protections turned on by default: a 24-hour minimum release age, default-deny lifecycle scripts, typosquat detection, and optional jailed builds for approved dependencies. I wrote about it in [Aube: A New Dawn for Node Installs](/aube-a-new-dawn-for-node-installs).
