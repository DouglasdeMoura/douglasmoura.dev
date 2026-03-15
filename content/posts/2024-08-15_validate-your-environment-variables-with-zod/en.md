---
title: Validate your environment variables with Zod
slug: validate-your-environment-variables-with-zod
locale: en-US
created: 2024-08-15 14:14:26.654Z
updated: 2024-08-15 14:17:19.617Z
tags:
  - Zod
  - TypeScript
  - Tips
cover: ./cover.jpg
type: post
---

[Zod](https://github.com/colinhacks/zod) is the most famous validation library in the TypeScript ecosystem. With Zod, you create a _schema_ and validate your data according to the schema. Observe the schema below:

```ts
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(1),
  age: z.number({ coerce: true }).min(18),
  email: z.string().email(),
});
```

This schema can be used to validate an object as follows:

```ts
const data = {
  name: "John Doe",
  age: 18,
  email: "john@example.com",
};

// If there is a validation error, it throws an error
const validatedData = UserSchema.parse(data);

// If there is a validation error, it returns an error object for you to handle later
const safeValidatedData = UserSchema.safeParse(data);
// => { success: false; error: ZodError }
// => { success: true; data: 'billie' }
```

Zod is capable of performing various types of validations on your data, so be sure to read the [documentation](https://github.com/colinhacks/zod) for more details.

## Validating Environment Variables

We can use Zod to validate the values present in [`process.env`](https://nodejs.org/api/process.html#processenv) and even process them before using the environment variables in our application. Usually, I like to create an `environment.ts` file, as in the example below:

```ts
import { z } from "zod";

const environmentSchema = z.object({
  // Define the possible values for NODE_ENV, always leaving a default value:
  NODE_ENV: z.enum(["test", "development", "production"]).default("production"),
  // Environment variables are always defined as strings. Here, convert the string to a number and set a default value:
  PORT: z.number({ coerce: true }).default(3000),
});

export const env = environmentSchema.parse(process.env);
```

Then, just import the variable and use it throughout my application:

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
