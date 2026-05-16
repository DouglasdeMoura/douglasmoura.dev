---
title: "Protecting your Node.js project against supply-chain attacks"
slug: protecting-your-node-js-project-against-supply-chain-attacks
locale: en-US
created: 2026-05-16 18:08:25.866Z
updated: 2026-05-16 20:16:18.000Z
tags:
  - Node.js
  - NPM
  - TypeScript
---
There has been a number of supply-chain attacks on NPM packages on the last few days, compromising Tanstack libraries, Axios, and a few other packages. Most of those attacks are detected and removed within a few hours, so, it's safe to say that delaying the install of fresh versions of the dependencies of your project can protect you against those malicious attacks.

NPM (11.10+), Yarn (4.10+), and PNPM (10.16+) have native support to that. PNPM, since version 11.0, event set 24 hours as the default cool down period to install new version of the packages.

## NPM

You can configure the minimum release age of the packages (in days) as following:

```bash
npm config set min-release-age <number of days> --location=<project|user|global>
```

This will write `min-release-age=<number of days>` to the `.npmrc` of the project (current directory where you are running the command above), the user (`~/.npmrc`), or the global configuration of NPM.

## Yarn (Berry 4.10+)

You can configure the minimal age gate for NPM packages (in minutes) as following:

```bash
yarn config set npmMinimalAgeGate 1440
```

This will write `npmMinimalAgeGate: 1440` to the `.yarnrc.yml` of the project (current directory where you are running the command above). Append `--home` to write to the `~/.yarnrc.yml`.

## PNPM

You can configure the minimum release age of the packages (in minutes) as following:

```bash
pnpm config set minimumReleaseAge 1440 --location=<project|user|global>
```

This will write `minimumReleaseAge: 1440` to the `pnpm-workspace.yaml` if you set the location to project or to `~/.config/pnpm/config.yaml` if you set to user.

## A note for Dependabot and Renovate users

The settings above are enforced at install time only. Dependabot and Renovate have their own configurations to enforce that. If you use Dependabot to auto-update your dependencies, you must also set the `cooldown.default-days` to the number of days you want. On Renovate, you must set the `minimumReleaseAge` value.
