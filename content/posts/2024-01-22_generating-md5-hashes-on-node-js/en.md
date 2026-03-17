---
title: Generating MD5 hashes on Node.js
slug: generating-md5-hashes-on-node-js
locale: en-US
created: 2024-01-23 13:20:06.581Z
updated: 2026-03-17 12:00:54.000Z
tags:
  - Node.js
  - javascript
cover: ./cover.jpg
type: post
---

You can create hashes in Node.js without the need to install any external library. Usually, I create the following utility function in the projects I work on:

```javascript
import { createHash } from "node:crypto";

/**
 * Hashes a string using md5
 *
 * @param {string} str
 * @returns {string}
 */
export const md5 = (str) => createHash("md5").update(str).digest("hex");
```

And I use it to replace the [md5](https://www.npmjs.com/package/md5) library whenever I come across it.

Note that you can create hashes for any algorithm supported by the OpenSSL version on your platform. On Linux and Mac, you can see which algorithms are available with the command `openssl list -digest-algorithms`.
