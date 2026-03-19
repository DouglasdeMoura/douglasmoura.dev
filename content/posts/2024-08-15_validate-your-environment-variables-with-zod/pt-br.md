---
title: Valide suas variáveis de ambiente com Zod
slug: valide-suas-variaveis-de-ambiente-com-zod
locale: pt-BR
created: 2024-08-15 13:51:14.579Z
updated: 2024-08-15 14:16:39.812Z
tags:
  - Tips
  - TypeScript
  - Zod
cover: ./cover.jpg
type: post
---

[Zod](https://github.com/colinhacks/zod) é a biblioteca de validação mais famosa do ecossistema TypeScript. Com Zod, você cria um *schema* e valida seus dados de acordo com o *schema*. Observe o *schema* abaixo:

```ts
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(1),
  age: z.number({ coerce: true }).min(18),
  email: z.string().email(),
});
```

Este *schema* pode ser usado para validar um objeto da seguinte maneira:

```ts
const data = {
  name: "John Doe",
  age: 18,
  email: "john@example.com",
};

// Caso haja um erro na validação, lança um erro
const validatedData = UserSchema.parse(data);

// Caso haja um erro na validação, retorna um objeto com erro, para você tratar posteriormente
const safeValidatedData = UserSchema.safeParse(data);
// => { success: false; error: ZodError }
// => { success: true; data: 'billie' }
```

O Zod é capaz de fazer diversos tipos de validações nos seus dados, certifique-se de ler a [documentação](https://github.com/colinhacks/zod) para mais detalhes.

## Validando as variáveis de ambiente

Podemos usar o Zod para validar os valores presentes no [`process.env`](https://nodejs.org/api/process.html#processenv) e até processá-los antes de usar as variáveis de ambiente na nossa aplicação. Normalmente, eu gosto de criar um arquivo `environment.ts`, como no exemplo abaixo:

```ts
import { z } from "zod";

const environmentSchema = z.object({
  // Define os valores possíveis para o NODE_ENV, deixando sempre um valor padrão:
  NODE_ENV: z.enum(["test", "development", "production"]).default("production"),
  // Variáveis de ambiente sempre são definidas como strings. Aqui, transformo a string em número e defino um valor padrão:
  PORT: z.number({ coerce: true }).default(3000),
});

export const env = environmentSchema.parse(process.env);
```

Depois, é só importar a variável e usar ao longo da minha aplicação:

```ts
import Fastify from "fastify";
import { env } from "./environment.js";

const app = Fastify({ logger: true });
app.listen({ port: env.PORT }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
```
