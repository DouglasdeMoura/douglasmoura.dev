---
title: The minimum you need to know to test your APIs with CURL
slug: the-minimum-you-need-to-know-to-test-your-apis-with-curl
locale: en-US
created: 2023-08-30 18:41:29.529Z
updated: 2024-06-02 00:25:38.664Z
tags:
  - curl
  - API
  - HTTP
cover: ./cover.jpg
---

[CURL](https://github.com/curl/curl) is a command-line tool that allows you to transmit data with URL syntax, supporting a myriad of protocols (DICT, FILE, FTP, FTPS, GOPHER, GOPHERS, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, MQTT, POP3, POP3S, RTMP, RTMPS, RTSP, SCP, SFTP, SMB, SMBS, SMTP, SMTPS, TELNET, TFTP, WS and WSS). In this article, I will focus on using CURL to make HTTP requests to APIs, which, at least for me, is the most common use.

## Installation

CURL is already installed on most Linux distributions and [recent versions of Windows](https://techcommunity.microsoft.com/t5/containers/tar-and-curl-come-to-windows/ba-p/382409). To check if it's installed, just run the `curl` command in the terminal. If you don't have CURL installed, you can install it with the command `sudo apt install curl` (Ubuntu/Debian) or `sudo yum install curl` (CentOS/Fedora) or `winget install curl` (Windows).

Oh, and as it is common for us to work with REST APIs in web development, another command-line tool that will be useful to us is [`jq`](https://jqlang.github.io/jq/), which serves to format JSON in the terminal. To install `jq`, just run the command `sudo apt install jq` (Ubuntu/Debian) or `sudo yum install jq` (CentOS/Fedora) or `winget install jqlang.jq` (Windows).

## Our example API

For didactic purposes, I will use [DummyJSON](https://dummyjson.com/) as an API.

## Making a GET request

To make a GET request, just run the `curl` command followed by the URL you want to access. For example, to request data for product 1, just run the command `curl https://dummyjson.com/products/1`.

And, to format the output, just add a `| jq` at the end of the command:

```bash
curl https://dummyjson.com/products/1 | jq
```

## Making a POST, PUT, PATCH or DELETE request with JSON in the body

To make a POST request, just run:

```bash
curl --json '{"title": "New product"}' https://dummyjson.com/products/add
```

The `curl` will take care of adding the headers `Content-Type: application/json` and `Accept: application/json`. If you want to make a `PUT`, `PATCH` or `DELETE` request, add the `-X` option followed by the HTTP method you want to use. For example, to make a `PUT`, run:

```bash
curl -X PUT --json '{"title": "New title"}' https://dummyjson.com/products/1
```

You can also send a JSON file instead of typing the JSON in the terminal by putting an @ in front of the file name:

```bash
curl --json @arquivo.json https://dummyjson.com/products/add
```

Or passing data from [*stdin*](https://man.archlinux.org/man/stdin.3.en) (note that I use `@-` instead of `@` to indicate that the data will come from *stdin*):

```bash
curl --json @- https://dummyjson.com/products/add < file.json
```

## Making a request with headers

To make a request with headers, just run the `curl` command followed by the URL you want to access, and the `-H` option followed by the header you want to send. So, to send a Bearer Token, you would run the following command:

```bash
curl -H "Authentication: Bearer token" --json '{"title": "New product"}' https://dummyjson.com/products/add
```

## Some Exercises

Julia Evans published a few exercises to help you become fluent in curl. It should be worth to take a look at [this post](https://jvns.ca/blog/2019/08/27/curl-exercises/) in her blog.

## References

- [curl manpage](https://manpages.ubuntu.com/manpages/lunar/en/man1/curl.1.html)
