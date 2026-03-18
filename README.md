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

## AI Skills

This project uses [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skills for design and code quality:

- **[Impeccable](https://impeccable.style/)** — Frontend design skills (audit, critique, polish, animate, and more) for building distinctive interfaces
- **[Vercel React Best Practices](https://vercel.com/blog/introducing-react-best-practices)** — Performance optimization rules for React and Next.js from Vercel Engineering
- **[Emil Kowalski's Design Engineering](https://emilkowal.ski/)** — UI polish, component design, animation decisions, and the invisible details that make software feel great
- **[Humanizer](https://github.com/blader/humanizer)** — Removes signs of AI-generated writing from text, making it sound more natural and human

Skills are installed in `.agents/skills/` and configured via `.claude/skills/`.

## Scripts

| Script         | Description                    |
| -------------- | ------------------------------ |
| `pnpm dev`     | Start development server       |
| `pnpm build`   | Build for production           |
| `pnpm release` | Build and deploy to Cloudflare |
| `pnpm cli`     | Run project CLI                |
| `pnpm check`   | Lint check                     |
| `pnpm fix`     | Auto-fix lint/format issues    |
