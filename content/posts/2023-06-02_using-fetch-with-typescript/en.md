---
title: Using fetch with TypeScript
slug: using-fetch-with-typescript
locale: en-US
created: 2023-06-02 12:19:46.717Z
updated: 2023-06-04 19:57:40.482Z
tags:
  - typescript
  - javascript
cover: ./cover.png
---

Since [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)) is pratically [universally supported](https://caniuse.com/?search=fetch) on the most used web browsers, we may safely drop the use [Axios](https://axios-http.com/) and other similar libraries in favor of `fetch`. In this article, I'll create a little wrapper for `fetch` that adds some conveniences to improve the developer experience.

## The code

First, I will create a base function from where all the other shall be derived:

```typescript
// Extends the error class to throw HTTP Errors (any response with status > 299)
class HTTPError extends Error {}

//            A generic type to type the response
// -----------\/
const query = <T = unknown>(url: RequestInfo | URL, init?: RequestInit) =>
  fetch(url, init).then((res) => {
    if (!res.ok) throw new HTTPError(res.statusText, { cause: res });

    return res.json() as Promise<T>; // <--- Applying the generic type above
  });
```

In the code above, we:

1. Created a new `HTTPError` class, in order to throw [HTTP Errors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) as they appear;
2. Use a [generic type](https://www.typescriptlang.org/docs/handbook/2/generics.html) in order to be able to type the response of the request.

Now, let's extend the query function to enable us to serialize and send data on our requests:

```typescript
const makeRequest =
  // -----------\/ RequestInit['method'] is a union of all the possible HTTP methods
  (method: RequestInit["method"]) =>
    //     | Those two generic types enables us to type the
    // \/--  data input (TBody) and output (TResponse) of the function.
    <TResponse = unknown, TBody = Record<string, unknown>>(
      url: RequestInfo | URL,
      body: TBody
    ) =>
      query<TResponse>(url, {
        method,
        body: JSON.stringify(body), // <-- JSON Stringify any given object
      });
```

In the code above, we:

1. We build a [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) that, first, receive the method we want to call and then returns a function where we pass the `url` and the `body` (which is, by default, *JSON-stringified*) of the request.

At this point, we can use our newly created functions like this:

```typescript
// Adding type for the Product entity
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

// Getting a single product
const product = await query<Product>("https://dummyjson.com/products/1");
console.log(product);

// Creates a function that makes POST requests
const post = makeRequest("POST");

// Adding a new product
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

Fully functional, but not very "ergonomic". I believe that our code should also be able to accept a base URL for all the requests, make it easier to add things on the header (like an [authorization token](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)) and an easy way to make [`PATCH`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH), [`PUT`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) and [`DELETE`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE) requests.

Let's refactor the code above in order to make it easy to add a base URL and pass a common header to all requests:

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

// This is the function where we define our base URL and headers
const query = createQuery("https://dummyjson.com", {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`, // If you need to add a token to the header, you can do it here.
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

In the code above, I:

1. Created a `createQuery` function, a closure where I can set a default [`url`](https://developer.mozilla.org/pt-BR/docs/Web/API/URL) and `init` parameters;
2. Created a new `query` function, where I use the `createQuery` function to define the base URL and the default parameters that all requests should have (note the dummy `getToken` function that adds a [Bearer Token](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) to each request);
3. In the end, I export the `api` object all the commonly used function to make requests.

You may want to return the body of a request that returned an error, like, for example, when your backend returns the standardized [problem details](https://datatracker.ietf.org/doc/html/rfc7807). So, the refactored code would be:

```typescript
import { getToken } from "my-custom-auth";

// Extends the return of the HTTPError class
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
      // Now, we get the JSON response early
      const response = await res.json();

      if (!res.ok) throw new HTTPError(res.status, res.statusText, response);

      return response as TResponse;
    });

// In this function, we define our base URL and headers.
const query = createQuery("https://dummyjson.com", {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`, // If you need to add a token to the header, you can do it here.
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

And now, you can use your new wrapper around fetch like this:

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

## Final thoughts

The code above is not full-featured as [Axios](https://axios-http.com/), [redaxios](https://github.com/developit/redaxios), [ky](https://github.com/sindresorhus/ky) or [wretch](https://github.com/elbywan/wretch), but, most of the time, it is all need when I'm working with React using [SWR](https://swr.vercel.app/) or [TanStack Query](https://tanstack.com/query/latest) (and on the backend too). Give me your thoughts about the code and show me your improvements (if you want). You can access this code on this [gist](https://gist.github.com/DouglasdeMoura/59ce418672d0e33dda7056b382b01de9).
