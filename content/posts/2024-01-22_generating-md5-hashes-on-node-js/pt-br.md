---
title: Gerando hashes MD5 no Node.js
slug: gerando-hashes-md-5-no-node-js
locale: pt-BR
created: 2024-01-22 20:36:58.299Z
updated: 2026-03-17 11:45:02.000Z
tags:
  - javascript
  - Node.js
cover: ./cover.jpg
type: post
---

Você pode criar *hashes* com Node.js sem a necessidade instalar nenhuma biblioteca externa. Normalmente eu crio a seguinte função utilitária nos projetos em que trabalho:

```javascript
import { createHash } from "node:crypto";

/**
 * Cria um hash MD5 para a string dada
 *
 * @param {string} str
 * @returns {string}
 */
export const md5 = (str) => createHash("md5").update(str).digest("hex");
```

E a uso para substituir a biblioteca [md5](https://www.npmjs.com/package/md5) sempre que encontro.

Note que você pode criar *hashes* para qualquer algoritmo suportado pela versão do OpenSSL da sua plataforma. No Linux e no Mac, você pode ver quais os algoritmos disponíveis com o comando `openssl list -digest-algorithms`.
