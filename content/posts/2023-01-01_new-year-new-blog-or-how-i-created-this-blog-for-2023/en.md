---
title: New year, new blog (or how I created this blog for 2023)
slug: new-year-new-blog-or-how-i-created-this-blog-for-2023
locale: en-US
created: 2023-01-01 18:29:53.355Z
updated: 2023-08-12 13:31:07.448Z
tags:
  - designsystem
  - webdev
  - programming
cover: ./cover.jpg
---

New year, new blog! After delaying the publication of my blog for a long time, I finally finished developing it using [Next.js](https://nextjs.org/), [PocketBase](https://pocketbase.io/), and [Mantine](https://mantine.dev/). Want to know why I chose these tools? Then, keep reading here with me.

I've been creating blogs for a long time (since 2007). I started with Blogger, but then I migrated to WordPress. And that's when I started to be interested in Linux and programming. I spent a lot of time creating themes, customizing plugins, reading documentation, and translating themes and plugins for WordPress. And, although WordPress is an excellent CMS for those who just want to publish a website as quickly as possible, this time I wanted something more personalized, containing all the features I would like to have and nothing more. From there, I started researching.

I tried several CMSs ([Directus](https://directus.io/), [KeystoneJS](https://keystonejs.com/),
[Strapi](https://strapi.io/) and [Cockpit](https://getcockpit.com/)), but what I found most simple to meet my need was [PocketBase](https://pocketbase.io/), mainly because I intended to self-host my solution. The other CMSs are great, but when you're a team of one, you have to choose the right tools. And what's easier for one person to manage than an SQLite database? PocketBase already exposes database updates in real time with SSE, provides authentication and file management (with integration with S3), SDK for JavaScript and Flutter, and can even be used as a framework. All this within a small binary written in Go (if you want to know more about PocketBase, [read the documentation](https://pocketbase.io/docs/) and watch this video from [FireShip](https://www.youtube.com/watch?v=Wqy3PBEglXQ), where he shows how to create a real-time chat system with PocketBase). And finally, in order to have real-time backups of my SQLite database and send them to S3, I use [Litestream](https://litestream.io/). Well, having made the choice for the backend, let's move on to the frontend.

I tried [Astro](https://astro.build/) (which is excellent!) and [Remix](https://remix.run/), but I ended up choosing Next.js, mainly because of the Vercel image generation library, which I use to generate images of the post, like this one:

<img src="https://douglasmoura.dev/api/v1/og?ok" alt="The job that's never started as takes longest to finish" />

And here we come to the choice of what I would use to create the styles of the blog. In recent years, I styled React applications with [CSS Modules](https://github.com/css-modules/css-modules), [Styled Components](https://styled-components.com/), [Stitches](https://stitches.dev/), [Tailwind](https://tailwindcss.com/) and [Chakra UI](https://chakra-ui.com/). I even stated to create a Design System with Stitches and Tailwind, but create an entire Design System all by myself would take a long time, so, I decided to take the shorter route.

I have tried a few libraries until I found [Mantine](https://mantine.dev/), which is an excellent library packaged with everything I wanted to use.
From there, the work consisted of implementing the blog with the basic initial features:

- [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration) of posts;
- Form validation with [Zod](https://github.com/colinhacks/zod);
- Nested comment system with anti-spam verification provided by [Akismet](https://akismet.com/);
- Display of commentator avatars with [Gravatar](http://pt.gravatar.com/);
- SVG Favicon with light/dark mode;
- I18n (Portuguese and English).

With all that ready, I changed the canonical URLs of my articles on [Dev.to](https://dev.to/douglasdemoura) to point to the new URLs and finally published my blog.

Of course, if you're reading this on my blog now, you'll see that an important feature is still missing: search. I'll be studying possible solutions for this in the coming days, but I'll already let you know that you can preview the functionality by pressing the <kbd>/</kbd> key on any page.

Happy 2023, everyone 🎉.
