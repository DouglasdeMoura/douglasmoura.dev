---
title: O mínimo que você precisa saber para testar suas APIs com CURL
slug: o-minimo-que-voce-precisa-saber-para-testar-suas-apis-com-curl
locale: pt-BR
created: 2023-08-30 17:28:52.275Z
updated: 2026-03-20 19:14:33.000Z
tags:
  - curl
  - API
  - HTTP
cover: ./cover.jpg
---

O [CURL](https://github.com/curl/curl) é uma ferramenta de linha de comando que permite transmitir dados com sintaxe de URL, suportando uma miríade de protocolos (DICT, FILE, FTP, FTPS, GOPHER, GOPHERS, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, MQTT, POP3, POP3S, RTMP, RTMPS, RTSP, SCP, SFTP, SMB, SMBS, SMTP, SMTPS, TELNET, TFTP, WS e WSS). Neste artigo, vou focar no uso do CURL para fazer requisicões HTTP para APIs, que, pelo menos, para mim, é o uso mais comum.

## Instalação

O CURL já vem instalado na maioria das distribuições Linux e nas versões [mais recentes do Windows](https://techcommunity.microsoft.com/t5/containers/tar-and-curl-come-to-windows/ba-p/382409). Para verificar se ele está instalado, basta executar o comando `curl` no terminal. Se você não tiver o CURL instalado, você pode instalar com o comando `sudo apt install curl` (Ubuntu/Debian) ou `sudo yum install curl` (CentOS/Fedora) ou `winget install curl` (Windows).

Ah, e como é comum que trabalhemos com APIs REST no desenvolvimento web, outra ferramenta de linha de comando que nos será útil é a [`jq`](https://jqlang.github.io/jq/), que serve para formatar o JSON no terminal. Para instalar a `jq`, basta executar o comando `sudo apt install jq` (Ubuntu/Debian) ou `sudo yum install jq` (CentOS/Fedora) ou `winget install jqlang.jq` (Windows).

## Nossa API de exemplo

Para fins didáticos, vou usar o [DummyJSON](https://dummyjson.com/) como API.

## Fazendo uma requisição GET

Para fazer uma requisição GET, basta executar o comando `curl` seguido da URL que você quer acessar. Por exemplo, para solicitar os dados do produto 1, basta executar o comando `curl https://dummyjson.com/products/1`.

E, para formatar a saída, basta adiciona um `| jq` ao final do comando:

```bash
curl https://dummyjson.com/products/1 | jq
```

## Fazendo uma requisição POST, PUT, PATCH ou DELETE com JSON no corpo

Para fazer uma requisição POST, basta executar:

```bash
curl --json '{"title": "Novo produto"}' https://dummyjson.com/products/add
```

O `curl` se encarregará de adicionar os cabeçalhos `Content-Type: application/json` e `Accept: application/json`. Caso queira fazer uma requisição do tipo `PUT`, `PATCH` ou `DELETE`, adicione a opção `-X` seguida do método HTTP que você quer usar. Por exemplo, para fazer um `PUT`, execute:

```bash
curl -X PUT --json '{"title": "Novo título"}' https://dummyjson.com/products/1
```

Você também pode enviar um arquivo JSON ao invés de digitar o JSON no terminal colocando um `@` na frente do nome do arquivo:

```bash
curl --json @arquivo.json https://dummyjson.com/products/add
```

Ou passando os dados do [*stdin*](https://man.archlinux.org/man/stdin.3.en) (note que eu uso `@-` ao invés de `@` para indicar que os dados virão do *stdin*):

```bash
curl --json @- https://dummyjson.com/products/add < arquivo.json
```

## Fazendo uma requisição com cabeçalhos

Para fazer uma requisição com cabeçalhos, basta executar o comando `curl` seguido da URL que você quer acessar, e da opção `-H` seguida do cabeçalho que você quer enviar. Então, para enviar um Bearer Token, você executaria o seguinte comando:

```bash
curl -H "Authentication: Bearer token" --json '{"title": "Novo produto"}' https://dummyjson.com/products/add
```

## Alguns exercícios

Julia Evans publicou alguns exercícios para você ficar fluente no uso do curl. Vale a pena dar uma olhada [neste artigo](https://jvns.ca/blog/2019/08/27/curl-exercises/) no blog dela.

## Referências

- [curl manpage](https://curl.se/docs/manpage.html)
