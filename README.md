# douglasmoura.dev

Personal blog built with [Redwood SDK](https://rwsdk.com/) and deployed to Cloudflare Workers.

## Stack

- **Framework:** Redwood SDK + React 19 (Server Components)
- **Styling:** Tailwind CSS v4
- **Hosting:** Cloudflare Workers
- **Content:** Markdown files with YAML frontmatter (bilingual: EN/PT-BR)
- **Code quality:** Ultracite (oxlint + oxfmt)

## Getting started

```shell
pnpm install
pnpm dev
```

## CLI

A project CLI manages blog content. Run `pnpm cli --help` for all commands.

```shell
pnpm cli posts create          # Create a new post (interactive)
pnpm cli posts list             # Browse posts with pagination
pnpm cli posts read [slug]      # Read a post in the terminal
pnpm cli posts import           # Import from Pocketbase
```

## Content structure

Posts live in `content/posts/` as date-prefixed directories with locale-named markdown files:

```
content/posts/
├── 2024-08-15_validate-your-environment-variables-with-zod/
│   ├── en.md
│   ├── pt-br.md
│   └── cover.jpg
├── 2024-09-27_o-dia-em-que-quase-fui-envolvido-em-um-crime-eleitoral/
│   ├── pt-br.md
│   └── cover.jpg
```

## Scripts

| Script         | Description                    |
| -------------- | ------------------------------ |
| `pnpm dev`     | Start development server       |
| `pnpm build`   | Build for production           |
| `pnpm release` | Build and deploy to Cloudflare |
| `pnpm cli`     | Run project CLI                |
| `pnpm check`   | Lint check                     |
| `pnpm fix`     | Auto-fix lint/format issues    |
