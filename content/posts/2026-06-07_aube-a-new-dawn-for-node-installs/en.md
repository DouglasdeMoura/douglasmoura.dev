---
title: "Aube: A New Dawn for Node Installs"
slug: aube-a-new-dawn-for-node-installs
locale: en-US
created: 2026-06-07 01:14:58.192Z
updated: 2026-06-07 02:19:14.000Z
cover: ./cover.webp
tags:
  - Node.js
  - npm
  - Package Manager
  - TypeScript
---
In my [previous post](/protecting-your-node-js-project-against-supply-chain-attacks), I wrote about how to protect your Node.js project against supply-chain attacks. Now, I'm going further with a tool I discored recently: [Aube](https://aube.en.dev/) (pronounced "ohb", from the French word for dawn) is a new Node.js package manager written in Rust by [en.dev](https://github.com/endevco), the same developer behind [Mise](https://douglasmoura.dev/managing-your-development-environment-with-mise). It reads and writes your existing lockfile (`pnpm-lock.yaml`, `package-lock.json`, `npm-shrinkwrap.json`, `yarn.lock`, or `bun.lock`) in place, so you can try it in a project without forcing your team to switch package managers. I started using it this week, and I want to share my thoughts on the tool.

## Speed

Aube starts from pnpm's isolated symlink model: package files live in a global content-addressable store, and projects link to them through an isolated `node_modules` layout. Aube also enables its global virtual store by default for local installs, while pnpm leaves its comparable feature off by default. The results show in the current benchmarks against a ~1400-package real-world fixture:

| Scenario | aube | bun | deno | pnpm | npm | yarn |
|---|---|---|---|---|---|---|
| Fresh install (warm cache) | 272 ms | 2.00 s | 1.33 s | 2.34 s | 7.14 s | 8.86 s |
| Fresh install (cold cache) | 7.95 s | 5.78 s | 8.15 s | 15.87 s | 9.51 s | 13.19 s |
| `install && test` (already installed) | 9 ms | 41 ms | 84 ms | 335 ms | 745 ms | 1.18 s |

The cold-cache number still trails Bun, but the warm-cache and repeat-command numbers are where aube pulls ahead. The `install && test` row is the developer loop: aube can skip install work when its install-state file is fresh, so repeated `aubr test` runs land in single-digit milliseconds.

## Lockfile compatibility

This is the part that caught my attention. Aube does not introduce its own lockfile format unless you want it to. If your project already has `pnpm-lock.yaml`, aube reads and writes it back in place. Same for `package-lock.json`, `npm-shrinkwrap.json`, `yarn.lock`, and `bun.lock`. That means you can run `aubr test` in a pnpm project today and your teammates who use pnpm will not notice a difference.

| Lockfile | Reads | Writes in place |
|---|---|---|
| `aube-lock.yaml` | yes | yes |
| `pnpm-lock.yaml` v9 | yes | yes |
| `package-lock.json` v2/v3 | yes | yes |
| `npm-shrinkwrap.json` | yes | yes |
| `yarn.lock` (v1 classic + v2+ berry) | yes | yes |
| `bun.lock` | yes | yes |

For a new project with no lockfile, aube creates `aube-lock.yaml`.

## `aubr` and `aubx`

`aubr` is shorthand for `aube run`. Before running a script, it checks whether `node_modules` is fresh for the current `package.json` and lockfile. If dependencies are missing or stale, it installs them first; otherwise it skips straight to the script:

```bash
aubr test
aubr build
```

`aubx` is shorthand for `aube dlx`. It prefers an installed local binary before fetching into a throwaway environment. Useful for one-off tools:

```bash
aubx cowsay hi
```

Both are multicall shims that share the same binary as `aube` and dispatch on `argv[0]`. Every flag that works on the full command also works on the shim.

## Less disk usage

Like pnpm, aube keeps package files in a global content-addressable store (`~/.local/share/aube/store/`) and links projects to it. Three apps that depend on React, Vite, TypeScript, and Playwright share the heavy files instead of storing three full copies. Aube claims up to 90% less disk usage compared to npm's approach of copying dependencies into every project.

## Security defaults

Aube ships with several supply-chain protections turned on by default:

- **Trust policy** (`trustPolicy: no-downgrade`) — blocks installs of a version that carries weaker trust evidence than any earlier-published version of the same package. A trust downgrade may indicate account takeover, repository tampering, or a malicious co-maintainer.
- **Minimum release age** — 24-hour cooldown on newly published versions by default (`minimumReleaseAge: 1440`). Catches typo-squat and dependency-confusion attacks that get unpublished within hours.
- **Default-deny lifecycle scripts** — dependency lifecycle scripts (`preinstall`, `install`, `postinstall`) do not run unless you approve them explicitly via `aube approve-builds`. A suspicious-script content sniff warns about known-dangerous patterns like `curl | sh`, base64-decode-then-evaluate, and reads of credential files.
- **Optional jailed builds** — when `jailBuilds: true` is enabled and a dependency is approved to build, aube can wrap the script with a Seatbelt profile (macOS), Landlock and seccomp (Linux), or a scrubbed environment (Windows) to deny network access and limit filesystem writes. This is included in `paranoid: true`, but it is not the default today.
- **Typosquat protection** — `aube add` checks the package you add and the resolved transitive dependency graph against OSV for `MAL-*` malicious-package advisories, and prompts for confirmation when a public package has a low download count.
- **Block exotic transitive dependencies** — rejects transitive dependencies that resolve to `git+`, `file:`, or direct tarball URLs, which skip the registry and its integrity verification.

There is a `paranoid: true` switch that bundles all of the strict settings at once:

```yaml
# aube-workspace.yaml
paranoid: true
allowBuilds:
  esbuild: true
  sharp: true
```

This forces jailed builds, no-downgrade trust policy, strict release-age gating, strict store integrity, strict dependency-build review, and mandatory advisory checks.


## Getting started

The recommended installation path is [Mise](https://mise.en.dev/):

```bash
mise use -g aube
```

It is also available via Homebrew (`brew install endevco/tap/aube`) and npm (`npm install -g --ignore-scripts=false @endevco/aube`).

Inside an existing Node.js project, just run:

```bash
aubr test
```

Aube will install dependencies if needed and then run the script. No migration step, no lockfile conversion.

## Daily commands

```bash
aube add react          # add a dependency
aube add -D vitest      # add a dev dependency
aube remove react       # remove a dependency
aube update             # update within package.json ranges
aubr build              # run a script, auto-installing if needed
aube test               # run tests, auto-installing if needed
aubx cowsay hi          # run a one-off tool
aube install            # install only (setup, Docker, CI)
aube ci                 # clean, frozen install for CI
```

You can also run scripts directly:

```bash
aube dev
aube build
aube lint
```

If the script exists in `package.json`, aube treats that as `aube run <script>`.

## Audit

Aube has a built-in audit command that uses the same advisory data source as `npm audit` and `pnpm audit`:

```bash
aube audit                  # list known CVEs at low+ severity
aube audit --audit-level high
aube audit --fix            # write package.json overrides to patched versions
aube audit --json | jq      # machine-readable for CI
```

## When to use it

Aube is worth trying if you want faster installs without changing your team's workflow. The lockfile compatibility means you can use it locally while your CI and teammates continue with pnpm, npm, or Yarn. The security defaults are the most aggressive of any Node.js package manager I have seen, and `paranoid: true` adds a lifecycle-script jail when you want the stricter bundle.

The project is young (v1.x, MIT-licensed, [on GitHub](https://github.com/endevco/aube)) but moving fast. If you are already using Mise, the install is one command away.
