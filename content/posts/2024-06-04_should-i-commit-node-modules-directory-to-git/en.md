---
title: Should I commit node_modules directory to git?
slug: should-i-commit-node-modules-directory-to-git
locale: en-US
created: 2024-06-04 17:45:35.356Z
updated: 2024-06-04 17:49:44.038Z
tags:
  - Node.js
  - javascript
  - npm
cover: ./cover.webp
type: post
---

TL; DR: No. Please add `node_modules` to your `.gitignore` file:

```
node_modules
```

## But, why?

The `node_modules` directory is where your package manager (that can be [npm](https://www.npmjs.com/), [yarn](https://classic.yarnpkg.com/) or [pnpm](https://pnpm.io/)) will install all the project dependencies listed on your `package.json`. Regardless of the package manager you choose, a lockfile (`package-lock.json`, `yarn.lock` or `pnpm-lock.yaml`, respectelly) will be generated in the first time you install your project dependencies, describing the entire dependency tree. This way, every time you need to reinstall your project dependencies, you shall get the exact same files.

The lockfile should be commited to `git`, enabling the re-installation of the tree of dependencies in any other ambient, what makes unecessary to commit the `node_modules` directory to `git` (also, it cuts the size of your repository by a lot, as `node_modules` can consumes gigabytes of space).
