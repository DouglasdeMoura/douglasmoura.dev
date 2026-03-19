---
title: Usando fetch com TypeScript
slug: usando-fetch-com-typescript
locale: pt-BR
created: 2023-06-02 16:47:38.794Z
updated: 2023-06-04 19:57:59.762Z
tags:
  - javascript
  - typescript
cover: ./cover.png
---

Como [`fetch`](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API) é praticamente [universalmente suportado](https://caniuse.com/?search=fetch) nos navegadores web mais utilizados, podemos descartar, com segurança, o uso do [Axios](https://axios-http.com/) e outras bibliotecas similares em favor do `fetch`. Neste artigo, vou criar uma pequena abstração para o `fetch` que adiciona algumas conveniências para melhorar a experiência do desenvolvedor.

## O código

Primeiro, vou criar uma função base a partir da qual todas as outras serão derivadas:

```typescript
// Estende a classe de erro para gerar erros de HTTP (qualquer resposta com status > 299)
class HTTPError extends Error {}

//            Um tipo genérico para "tipar" a resposta
// -----------\/
const query = <T = unknown>(url: RequestInfo | URL, init?: RequestInit) =>
  fetch(url, init).then((res) => {
    if (!res.ok) throw new HTTPError(res.statusText, { cause: res });

    return res.json() as Promise<T>; // <--- Aplicando o tipo genérico
  });
```

No código acima, fizemos o seguinte:

1. Criamos uma nova classe `HTTPError`, para lançar [erros HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) conforme eles ocorrem;
2. Utilizamos um [tipo genérico](https://www.typescriptlang.org/docs/handbook/2/generics.html) para poder tipar a resposta da requisição.

Agora, vamos estender a função `query` para nos permitir serializar e enviar dados em nossas requisições:

```typescript
const makeRequest =
  // -----------\/ RequestInit['method'] são os tipos de métodos válidos para a requisição
  (method: RequestInit["method"]) =>
    //     | Esses dois tipos genéricos nos permitem tipar
    //     | o entrada de dados (TBody) e saída (TResponse) da função.
    <TResponse = unknown, TBody = Record<string, unknown>>(
      url: RequestInfo | URL,
      body: TBody
    ) =>
      query<TResponse>(url, {
        method,
        body: JSON.stringify(body), // <-- Transforma os objetos em uma string
      });
```

No código acima, fizemos o seguinte:

1. Criamos um [encerramento (closure)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) que, primeiramente, recebe o método que desejamos chamar e, em seguida, retorna uma função onde passamos a `url` e o `body` (que, por padrão, é *JSON-stringificado*) da requisição.

Neste ponto, podemos usar nossas funções recém-criadas da seguinte forma:

```typescript
// Tipo para a entidade Product
type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

// Requisitando um único produto
const product = await query<Product>("https://dummyjson.com/products/1");
console.log(product);

// Cria uma função que faz uma requisição de POST
const post = makeRequest("POST");

// Adiciona um novo produto
const newProduct = await post<Product, Omit<Product, "id">>(
  "https://dummyjson.com/products",
  {
    title: "New Product",
    description: "This is a new product",
    price: 100,
    discountPercentage: 0,
    rating: 0,
    stock: 0,
    brand: "New Brand",
    category: "New Category",
    images: [],
    thumbnail: "",
  }
);

console.log(newProduct);
```

Agora temos um código funcional, mas não muito "ergonômico". Acredito que nosso código precisa ser capar de aceitar uma URL base para todas as requisições, cabeçalhos (como um [token de autorização](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)) e um jeito mais fácil de fazer requisições do tipo [`PATCH`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH), [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) e [DELETE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE).

Vamos refatorar o código acima, de modo que adicionar uma URL base e cabeçalhos comuns a todas as requisições:

```typescript
import { getToken } from "my-custom-auth";

class HTTPError extends Error {}

const createQuery =
  (baseURL: RequestInfo | URL = "", baseInit?: RequestInit) =>
  <T = unknown>(url: RequestInfo | URL, init?: RequestInit) =>
    fetch(`${baseURL}${url}`, { ...baseInit, ...init }).then((res) => {
      if (!res.ok) throw new HTTPError(res.statusText, { cause: res });

      return res.json() as Promise<T>;
    });

// Esta é a função onde definimos nossa URL base e nossos cabeçalhos
const query = createQuery("https://dummyjson.com", {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`, // Se precisar adicionar um token no cabeçalho, este é o lugar
  },
});

const makeRequest =
  (method: RequestInit["method"]) =>
  <TResponse = unknown, TBody = Record<string, unknown>>(
    url: RequestInfo | URL,
    body: TBody
  ) =>
    query<TResponse>(url, {
      method,
      body: JSON.stringify(body),
    });

export const api = {
  get: query,
  post: makeRequest("POST"),
  delete: makeRequest("DELETE"),
  put: makeRequest("PUT"),
  patch: makeRequest("PATCH"),
};
```

No código acima, eu:

1. Criei a função `createQuery` , um fechamento (closure), permitindo definir uma URL padrão e parâmetros `init` predefinidos;
2. Criei uma nova função `query`, na qual utilizei a função `createQuery` para definir a URL base e os parâmetros padrão que todas as requisições devem ter (observe a função fictícia `getToken` que adiciona um [Bearer Token](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) a cada requisição);
3. No final, exportei o objeto `api` com todas as funções comumente usadas para fazer requisições.

Você pode querer retornar o corpo de uma requisição que retornou um erro, por exemplo, quando o backend retorna os detalhes padronizados do [problem details](https://datatracker.ietf.org/doc/html/rfc7807). Vejamos como fica o nosso código refatorado:

```typescript
import { getToken } from "my-custom-auth";

// Estende o retorno da classe HTTPError
class HTTPError extends Error {
  readonly response: any;
  readonly status: number;
  readonly statusText: string;

  constructor(status: number, statusText: string, response: any) {
    super(statusText);
    this.status = status;
    this.statusText = statusText;
    this.response = response;
  }
}

const createQuery =
  (baseURL: RequestInfo | URL = "", baseInit?: RequestInit) =>
  <TResponse = unknown>(url: RequestInfo | URL, init?: RequestInit) =>
    fetch(`${baseURL}${url}`, { ...baseInit, ...init }).then(async (res) => {
      // Desta vez, pegamos a resposta da requisição mais cedo
      const response = await res.json();

      if (!res.ok) throw new HTTPError(res.status, res.statusText, response);

      return response as TResponse;
    });

// Esta é a função onde definimos nossa URL base e nossos cabeçalhos
const query = createQuery("https://dummyjson.com", {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`, // Se precisar adicionar um token no cabeçalho, este é o lugar
  },
});

const makeRequest =
  (method: RequestInit["method"]) =>
  <TResponse = unknown, TBody = Record<string, unknown>>(
    url: RequestInfo | URL,
    body: TBody
  ) =>
    query<TResponse>(url, {
      method,
      body: JSON.stringify(body),
    });

export const api = {
  get: query,
  post: makeRequest("POST"),
  delete: makeRequest("DELETE"),
  put: makeRequest("PUT"),
  patch: makeRequest("PATCH"),
};
```

Agora você pode usar seu novo wrapper em torno do `fetch` da seguinte forma:

```typescript
type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

// GET https://dummyjson.com/products/1
api
  .get<Product>("/products/1")
  .then(console.log)
  .catch((err) => {
    if (err instanceof HTTPError) {
      // Handle HTTP Errors
      console.error("HTTPError", err);
    }

    if (err instanceof SyntaxError) {
      // Handle error parsing of the response
      console.error("SyntaxError", err);
    }

    console.error("Other errors", err);
  });
```

## Considerações finais

O código acima pode não ter todos os recursos completos de bibliotecas como [Axios](https://axios-http.com/), [redaxios](https://github.com/developit/redaxios), [ky](https://github.com/sindresorhus/ky) ou [wretch](https://github.com/elbywan/wretch), mas na maioria das vezes é tudo o que é necessário ao trabalhar com React usando [SWR](https://swr.vercel.app/) ou [TanStack Query](https://tanstack.com/query/latest) (tanto no frontend quanto no backend). Se quiser, dê sua opinião sobre o código e compartilhe suas melhorias. Este código está disponível neste [gist](https://gist.github.com/DouglasdeMoura/59ce418672d0e33dda7056b382b01de9).
