---
title: "Improving Scrollbar Appearance with CSS"
slug: improving-scrollbar-appearance-with-css
locale: en-US
created: 2026-04-27 20:13:29.906Z
updated: 2026-04-27 21:19:46.000Z
tags:
  - CSS
  - Tailwind
  - HTML
---

A few days ago I reposted a [tweet](https://x.com/raunofreiberg/status/2048057305439039535) with a tiny little snippet that makes the scrollbar much more pleasant-looking (image taken directly from the tweet above):

![A screenshot comparison taken from the original source](./img/scrollbar-comparison.png)

Of course, I implemented this on my blog with a single change: setting the scrollbar color to follow the color token of my Tailwind CSS custom theme:

```css [style.css]
@layer base {
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--color-border) transparent; # --color-border is the CSS variable that holds the color I want for my scrollbar
  }
}
```

I saw on MDN that there might be a few [accessibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scrollbar-width) concerns when you set the scrollbar to be thin. If this causes you too much trouble using this blog, please open an issue or submit a PR on this blog's [repository](https://github.com/DouglasdeMoura/douglasmoura.dev) (it's open source, after all).
