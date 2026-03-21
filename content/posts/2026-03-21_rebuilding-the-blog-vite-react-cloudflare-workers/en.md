---
title: Rebuilding the blog (Vite, React, and Cloudflare Workers)
slug: rebuilding-the-blog-vite-react-cloudflare-workers
locale: en-US
created: 2026-03-21 12:00:00.000Z
updated: 2026-03-21 18:08:35.000Z
tags:
  - webdev
  - programming
  - cloudflare
cover: ./cover.jpg
---

A few years ago I wrote about [how I put the previous version of this site together](https://douglasmoura.dev/new-year-new-blog-or-how-i-created-this-blog-for-2023): Next.js on the frontend, [PocketBase](https://pocketbase.io) on the backend, and [Mantine](https://mantine.dev) for UI. It worked well for what I needed at the time. This version is a different bet: content lives in the repo, and the whole thing runs on Cloudflare Workers.

## Why change at all?

Self-hosting PocketBase, [Litestream](https://litestream.io/), and everything around it was fine, but I wanted something simpler. Deploy one Worker, serve static assets from the same place, treat posts as Markdown files I can version and review like code. No database process to babysit, no admin panel that has to stay online for the blog to work.

## The shape of the app

The site is a React 19 app built with Vite and deployed as a Cloudflare Worker. Routing, layouts, and server rendering go through [RedwoodSDK](https://rwsdk.com/) (`rwsdk`), which lets me define routes, shared headers, feeds, and JSON APIs right next to the page tree. On the client side, RedwoodSDK handles navigation and hydration, so the UX stays snappy without turning the whole site into a heavy SPA.

## Content and Markdown

Posts live under `content/posts/` as Markdown with frontmatter, same idea as before, but now everything is bundled at build time. Vite’s `import.meta.glob` loads the files, gray-matter parses the metadata, and each locale is just another file in the same folder (English and Portuguese). I18n stays simple: URLs under `/pt-BR/…` for Brazilian Portuguese, default routes for English.

For rendering, I use [md4x](https://github.com/unjs/md4x) (WASM) for the Markdown itself, [Shiki](https://shiki.style/) for syntax highlighting, KaTeX for math, and a small footnotes pass. Enough to write technical posts without dragging half the internet into the runtime.

## Search (finally)

The [older post](https://douglasmoura.dev/new-year-new-blog-or-how-i-created-this-blog-for-2023) ended by saying search was still missing. After I wrote it, I hacked something together by loading all the posts from PocketBase as JSON and filtering on the frontend with [Fuse.js](https://www.fusejs.io/). I know, I know, not the best way of doing it, but it was an interesting experiment. Now search uses [Orama](https://docs.orama.com/docs/orama-js): at startup the Worker builds separate indexes for English and Portuguese (with the right stemmers), and `/api/v1/search` returns JSON for the UI. No external search service, no extra infrastructure.

## Social previews and feeds

Open Graph images are generated on the Worker with [workers-og](https://github.com/kvnang/workers-og) (React-style `ImageResponse`). Atom and RSS feeds are generated per locale, and there’s a sitemap route for search engines.

## Everything else

- Tailwind CSS v4 with the typography plugin for article styling.
- [Phosphor icons](https://phosphoricons.com/), [cmdk](https://github.com/dip/cmdk) for the command palette, [react-wrap-balancer](https://react-wrap-balancer.vercel.app/) for headings, and [react-tweet](https://react-tweet.vercel.app/) where posts embed tweets.
- A small `pnpm cli` (citty + consola + tsx) for creating and listing posts from the terminal and extracting translatable strings. I made my own <abbr title="internationalization">i18n</abbr> system, inspired by GNU [gettext](https://www.gnu.org/software/gettext/).
- [Ultracite](https://www.ultracite.ai/) (Oxlint + Oxfmt) keeps TypeScript and formatting consistent; [lefthook](https://lefthook.dev/) runs checks on commit.

I also added a few keyboard shortcuts I wished every blog had: <kbd>Ctrl</kbd>+<kbd>K</kbd> (or <kbd>⌘</kbd>+<kbd>K</kbd> on Mac) opens the command palette for search and quick navigation, <kbd>Alt</kbd>+<kbd>T</kbd> cycles through light, dark, and system themes, and <kbd>Alt</kbd>+<kbd>L</kbd> switches between English and Portuguese. Inside the command palette, you can press <kbd>0</kbd>–<kbd>3</kbd> to jump straight to Home, About, Talks, or Bookmarks.

## Why RedwoodSDK?

I followed [RedwoodJS](https://github.com/redwoodjs/graphql) for a while. The original pitch — full-stack React with GraphQL, Prisma, the works — was interesting, but it never quite caught on. Then the team pivoted. They dropped the GraphQL-centric design and rebuilt around Cloudflare Workers and web standards. What came out is [RedwoodSDK](https://rwsdk.com/), which is really a different project from what RedwoodJS was.

What got me interested was the ["personal software"](https://rwsdk.com/personal-software) angle. Peter Pistorius, the lead developer, talks about building software for yourself, not for enterprise scale. One Worker, one deploy target, Cloudflare's free tier. No $20/month hosting lock-in. That matched exactly what I wanted for this blog.

The framework doesn't try to be clever. No codegen, no magic file conventions, no hidden behavior. You work with `Request`, `Response`, and web APIs you already know. And since everything runs on Cloudflare, I get D1, R2, Durable Objects — all accessible without extra plumbing.

Mostly, though, I just wanted to try something different. I've been in the Next.js ecosystem since 2019. Building on a different set of tradeoffs sounded like a good exercise.

## Why leave Next.js at all?

I love Next.js and I've been using it in all my professional projects since 2019. The only reason I chose a different framework for this blog is that I wanted to try RedwoodSDK. I already miss one thing: the `Image` component. Right now I’m loading raw images without any optimization or responsive sizes. I might fix that later, but for now it stays as-is.

And there’s something else that's mostly a gut feeling: Next.js client navigation feels a little smoother. I can’t quite put it into words, but the Next.js team really nailed that experience. RedwoodSDK doesn't feel the same to me yet.

## Closing

This isn't the only way to run a personal blog. For me it’s the right tradeoff right now: one deployment target, Markdown in git, React where it helps, Workers at the edge. If you’re thinking about a similar move, I hope walking through the pieces saves you some digging.

*Cover photo: [Luca Onniboni](https://unsplash.com/@lucaonniboni) on [Unsplash](https://unsplash.com/photos/4v9Kk01mEbY).*
