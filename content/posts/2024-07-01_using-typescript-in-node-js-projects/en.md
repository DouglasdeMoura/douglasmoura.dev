---
title: Using TypeScript in Node.js projects
slug: using-typescript-in-node-js-projects
locale: en-US
created: 2024-07-01 12:24:04.381Z
updated: 2024-07-08 09:51:36.801Z
tags:
  - typescript
  - Node.js
  - javascript
cover: ./cover.jpg
type: post
---

[TypeScript](https://www.typescriptlang.org/) is tremendously helpful while developing Node.js applications. Let's see how to configure it for a seamless development experience.

## Setting up TypeScript

First, we need to install TypeScript. We can do this by running the following command:

```bash
npm i -D typescript
```

Next, we need to create a `tsconfig.json` file in the root of our project. This file will contain the TypeScript configuration for our project. Here is an example of a `tsconfig.json` file that I picked from [Total TypeScript](https://www.totaltypescript.com/tsconfig-cheat-sheet) and added a few more things (read the code and pay attention to the comments):

```json
{
  "compilerOptions": {
    /* Base Options: */
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "es2022",
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "verbatimModuleSyntax": true,

    /* Setting ~ as the alias for the src/ directory */
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"]
    },

    /* Strictness */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    /* If transpiling with TypeScript: */
    "module": "NodeNext",
    "outDir": "dist",
    "sourceMap": true,

    /* AND if you're building for a library: */
    "declaration": true,

    /* AND if you're building for a library in a monorepo: */
    "composite": true,
    "declarationMap": true,

    /* If NOT transpiling with TypeScript: */
    "module": "preserve",
    "noEmit": true,

    /* If your code runs in the DOM: */
    "lib": ["es2022", "dom", "dom.iterable"],

    /* If your code doesn't run in the DOM: */
    "lib": ["es2022"]
  },
  /* I'm considering all your code is in src/ */
  "include": ["src/**/*.ts"]
}
```

## Setting up the build script

Next, we need to set up a build script that will compile our TypeScript code to JavaScript. First, install [`tsc-alias`](https://www.npmjs.com/package/tsc-alias) to handle the aliases we defined in the `tsconfig.json` file:

```bash
npm i -D tsc-alias
```

Then, you can add the `build` script by adding the following script to our `package.json` file:

```json
{
  "scripts": {
    "build": "tsc && tsc-alias"
  }
}
```

## Setting up the development script

Next, we need to set up a development script that will watch for changes in our TypeScript files and recompile them. Personally, I like to use [`tsx`](https://tsx.is/), as it provides a much faster development experience compared to the built-in [TypeScript watcher](https://www.typescriptlang.org/docs/handbook/configuring-watch.html) or [ts-node](https://typestrong.org/ts-node/). First, install `tsx`:

```bash
npm i -D tsx
```

Then, you can add the `dev` script (in order to start the project in development mode) by adding the following script to your `package.json` file:

```json
{
  "scripts": {
    "build": "tsc && tsc-alias",
    "dev": "node --import=tsx --watch ./src/index.ts"
  }
}
```

Yes, you won't get typechecks while developing using `tsx`, but you can run `npm run build` for that or add a new `typecheck` scripts to your `package.json`, and run it whenever you want to check for type errors:

```json
{
  "scripts": {
    "build": "tsc && tsc-alias",
    "dev": "node --import=tsx --watch ./src/index.ts",
    "typecheck": "tsc --noEmit"
  }
}
```
