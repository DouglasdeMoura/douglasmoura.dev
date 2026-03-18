---
title: Dissecando URLs com JavaScript
slug: dissecando-urls-com-javascript
locale: pt-BR
created: 2023-09-11 12:48:41.199Z
updated: 2026-03-18 21:24:53.000Z
tags:
  - javascript
  - html
  - Node.js
cover: ./cover.jpg
---

Vamos entender o que significa cada parte de uma URL (Uniform Resource Locator). Observe a URL abaixo:

```
https://user:password@blog.exemple.com.br:443/posts?s=javascript&tags[]=html&tags[]=css#top
```

<aside data-alert data-color="blue" role="note">
<strong>URL (Uniform Resource Locator)</strong>
Uma URL é um endereço de uma localização específica na web e uma mecanismo que especifica a forma de recuperar este conteúdo, que pode ser um documento, uma imagem, um vídeo, etc.
</aside>

- `https://`: **Protocolo de comunicação** (padrão de comunicação utilizado entre o cliente e o servidor);
- `user:password@`: **Credenciais de autenticação para o [esquema Basic](https://datatracker.ietf.org/doc/html/rfc7617)** (obviamente, por questões de segurança, você **não** deve colocar suas credenciais diretamente na URL - inclusive, alguns navegadores [já não permitem mais isso](https://crbug.com/82250#c7));
- `blog`: **Subdomínio** (um domínio dentro de outro domínio);
- `exemple.com.br`: **Domínio** (nome do site);
- `.br`: **TLD (Top Level Domain)** (domínio de primeiro nível - identifica o país ou a região geográfica do site);
- `.com.br`: **SLD (Second Level Domain)** (domínio de segundo nível - alguns são reservados para entidades específicas, como governos, universidades, etc.);
- `:443`: **Porta de comunicação** (cada protocolo de comunicação possui uma porta padrão, por exemplo, o HTTP utiliza a porta 80 , HTTPS utiliza a porta 443. Porém, podemos utilizar outras portas, caso necessário);
- `/posts`: **Caminho do recurso no servidor**;
- `?s=javascript&tags[]=html&tags[]=css`: **Parâmetros da requisição** (informações adicionais que podem ser enviadas para o servidor);
- `#top`: **Âncora** (identifica um local específico dentro de uma página - normalmente utilizado para rolar a página até o local desejado).

## O construtor URL

O JavaScript possui um construtor chamado `URL` que nos permite criar um objeto com as informações de uma URL. Veja o exemplo abaixo:

```javascript
// Criando um objeto URL
const url = new URL(
  "https://user:password@blog.exemple.com.br:443/posts?s=javascript&tags[]=html&tags[]=css#top"
);

// Exibindo o objeto URL
console.log(url);
/*
Você verá o seguinte resultado:

URL {
  hash:  "#top"
  host: "blog.exemple.com.br"
  hostname: "blog.exemple.com.br"
  href: "https://user:password@blog.exemple.com.br:443/posts?s=javascript&tags[]=html&tags[]=css#top"
  origin: "https://blog.exemple.com.br"
  password: "password"
  pathname: "/posts"
  port: ""
  protocol: "https:"
  search: "?s=javascript&tags[]=html&tags[]=css"
  searchParams: URLSearchParams {size: 3}
  username: "user"
}
*/
```

Note que a porta está vazia, pois o protocolo HTTPS utiliza a porta 443 por padrão. Caso houvesse uma porta diferente, ela seria exibida no atributo `port`.

## O construtor URLSearchParams

O JavaScript também possui um construtor chamado [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) que nos permite criar um objeto com os parâmetros de uma URL. Veja o exemplo abaixo:

```javascript
// Criando um objeto URLSearchParams
const params = new URLSearchParams("s=javascript&tags[]=html&tags[]=css");
```

Note que ele já é está presente no objeto URL que criamos anteriormente (no attributo `searchParams`), de modo que podemos acessar os parâmetros da URL da seguinte maneira:

```javascript
const url = new URL(
  "https://user:password@blog.exemple.com.br:443/posts?s=javascript&tags[]=html&tags[]=css#top"
);

console.log(url.searchParams.get("s")); // javascript
console.log(url.searchParams.get("tags")); // ['html', 'css']
```

## Uma nota importante sobre a âncora

Os navegadores não enviam a âncora para o servidor, de modo que, no nosso exemplo, os caracteres `#top` só é acessível do lado do navegador. Algumas pessoas utilizam este recurso para armazenar o estado da aplicação ou informações encriptadas na URL que só serão acessíveis do lado do navegador, sem nunca ter acesso à isso pelo servidor.
