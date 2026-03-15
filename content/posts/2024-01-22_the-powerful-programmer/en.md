---
title: The Powerful Programmer
slug: the-powerful-programmer
locale: en-US
created: 2024-01-23 13:26:41.726Z
updated: 2024-01-25 17:03:59.369Z
tags:
  - Software Engineering
  - Patterns
  - Carreer
cover: ./cover.jpg
type: post
---

Estimating, implementing, and deploying software rapidly is a characteristic of powerful programmers, as [Kent Beck](https://www.kentbeck.com/) mentions in his book [Extreme Programming Explained](https://www.oreilly.com/library/view/extreme-programming-explained/0201616416/). In this article, I will explore these three points, inserting my own opinions on each one.

## Estimation

Estimating a software project is [difficult](https://jacobian.org/2021/may/20/estimation/), and there are various different techniques on how to estimate a software project. You can create a method, through your own experience, learn the method used by other companies but, you must pay attention that the central point is that you have a good idea of how much time the project will take. Projects have a beginning, middle, and end. Learn to estimate your work.

## Implementation

For me, particularly, implementing is the most fun part of the project. And as with any job, we have to be pragmatic in the choice of language and tools. Being pragmatic in the choice does not necessarily mean using the same as everyone else, because, often, some tools continue to be strong in the market due to pure inertia. [Express](https://expressjs.com/) is a good example of this. Besides there being many better options with better support (like [Fastify](https://fastify.dev/)), many teams still start new projects with Express, even if it is not being maintained regularly, does not handle Promise rejections, etc.

Besides the issue of tool choice, it is necessary that you **master** the technology stack of your project, being able to implement the best solutions in the shortest possible time. At the tip of your tongue, you have to know a good pattern to apply in the project, a good backend framework, a good frontend framework or even a good full-stack framework. And the experience of development cannot be left out. For the implementation to be fast, the understanding of the project must be easy, its documentation adequate, and its tests need to validate the **intention** flows of the user who will use the system.

## Deployment

Today, can you build an entire project and put it into production, by yourself? And I'm not talking about uploading your project to a completely managed platform, like Vercel, but rather, about taking a Linux machine, installing the necessary tools, and exposing your application to the web. And no, this is not any kind of purism. If you are not a startup that can burn a few million reais per year, without worrying about the cost of your infrastructure, you should, at least, know how to start your application and keep it active between server restarts (preferably using containers), put it behind a reverse proxy (like [NGINX](https://www.nginx.com/) or [Caddy](https://caddyserver.com/)), configure a firewall, and make a backup of the database in three different places. You can still bring up multiple instances of your application and use the same proxy tool as a load balancer to distribute your application's access to the different instances that are running.
