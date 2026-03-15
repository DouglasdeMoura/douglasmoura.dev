---
title: O que são padrões de projeto na engenharia de software?
slug: o-que-sao-padroes-de-projeto-na-engenharia-de-software
locale: pt-BR
created: 2023-09-04 20:00:07.730Z
updated: 2023-09-11 19:50:55.358Z
tags:
  - Engenharia de Software
  - Padrões de Projeto
cover: ./cover.jpg
---

No livro [_A Pattern Language_](https://en.wikipedia.org/wiki/A_Pattern_Language), Christopher Alexander e seus colegas definem um padrão como:

> Cada padrão descreve um problema que ocorre repetidamente em nosso ambiente e, em seguida, descreve o núcleo da solução para esse problema, de tal forma que você pode usar essa solução um milhão de vezes, sem nunca fazê-lo da mesma maneira duas vezes.

<div hidden>
Each pattern describes a problem which occurs over and over again in our environment, and then describes the core of the solution to that problem, in such a way that you can use this solution a million times over, without ever doing it the same way twice
</div>

Cristopher e os outros autores estavam se referindo a padrões de arquitetura de construção, mas, desde muito tempo, a disciplina de engenharia de software adotou este mesmo conceito para o desenvolvimento de software, que foi cristalizado pelo famoso livro [_Design Patterns: Elements of Reusable Object-Oriented Software_](https://engsoftmoderna.info/cap6.html#padr%C3%B5es-de-projeto) de Erich Gamma, Richard Helm, Ralph Johnson e John Vlissides (conhecidos como _Gang of Four_ ou _GoF_). No livro, eles definem padrões de projeto como:

> Padrões de projeto descrevem objetos e classes que se relacionam para resolver um problema de projeto genérico em um contexto particular.

É preciso entender que os padrões de projeto descritos nestes livros não são soluções que **devem** ser aplicadas em toda e qualquer situação, mas sim, descrições gerais de soluções para problemas comuns de projetos de software. Desse modo, as soluções propostas podem ser entendidas como um catálogo, a partir do qual pode-se estabelecer um vocabulário comum entre todas as pessoas envolvidas no desenvolvimento de um software, facilitando a comunicação e a compreensão do código.

Para ilustrar o que foi dito até aqui, vamos considerar um exemplo. Suponha que você está construindo um sistema de gerenciamento de uma biblioteca pessoal e, no seu banco de dados relacional, há uma tabela para armazenar os dados de um livro. A tabela pode ser criada com o seguinte comando SQL, em um banco de dados SQLite:

```sql
-- SQLite
CREATE TABLE
  `books` (
    `id` INTEGER NOT NULL PRIMARY KEY autoincrement,
    `author` TEXT NOT NULL,
    `title` TEXT NOT NULL,
    `isbn` TEXT NOT NULL,
    `updated_at` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
```

Vamos escolher o padrão [_Active Record_](https://www.martinfowler.com/eaaCatalog/activeRecord.html) para representar os dados de um livro no nosso sistema. Para isso, vamos criar uma classe em JavaScript conforme o diagrama abaixo:

<SVG64 
width={250}
content="PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDE5MS43NTUwNzA0OTM4NjYyNCAyMzUuMTQ1MjI2OTU1Mjc3NTYiIHdpZHRoPSI1NzUuMjY1MjExNDgxNTk4NyIgaGVpZ2h0PSI3MDUuNDM1NjgwODY1ODMyNiI+CiAgPCEtLSBzdmctc291cmNlOmV4Y2FsaWRyYXcgLS0+CiAgCiAgPGRlZnM+CiAgICA8c3R5bGUgY2xhc3M9InN0eWxlLWZvbnRzIj4KICAgICAgQGZvbnQtZmFjZSB7CiAgICAgICAgZm9udC1mYW1pbHk6ICJWaXJnaWwiOwogICAgICAgIHNyYzogdXJsKCJodHRwczovL2V4Y2FsaWRyYXcuY29tL1ZpcmdpbC53b2ZmMiIpOwogICAgICB9CiAgICAgIEBmb250LWZhY2UgewogICAgICAgIGZvbnQtZmFtaWx5OiAiQ2FzY2FkaWEiOwogICAgICAgIHNyYzogdXJsKCJodHRwczovL2V4Y2FsaWRyYXcuY29tL0Nhc2NhZGlhLndvZmYyIik7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgICAKICA8L2RlZnM+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjE5MS43NTUwNzA0OTM4NjYyNCIgaGVpZ2h0PSIyMzUuMTQ1MjI2OTU1Mjc3NTYiIGZpbGw9IiNmZmZmZmYiPjwvcmVjdD48ZyBzdHJva2UtbGluZWNhcD0icm91bmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEwIDEwKSByb3RhdGUoMCA4NS44Nzc1MzUyNDY5MzMxMiAxMDcuNTcyNjEzNDc3NjM4NzgpIj48cGF0aCBkPSJNMCAwIEM0MS42MSAwLCA4My4yMiAwLCAxNzEuNzYgMCBNMCAwIEM0MC40OSAwLCA4MC45OSAwLCAxNzEuNzYgMCBNMTcxLjc2IDAgQzE3MS43NiA2Ni42NiwgMTcxLjc2IDEzMy4zMSwgMTcxLjc2IDIxNS4xNSBNMTcxLjc2IDAgQzE3MS43NiA2Mi4zOCwgMTcxLjc2IDEyNC43NiwgMTcxLjc2IDIxNS4xNSBNMTcxLjc2IDIxNS4xNSBDMTE5LjM2IDIxNS4xNSwgNjYuOTYgMjE1LjE1LCAwIDIxNS4xNSBNMTcxLjc2IDIxNS4xNSBDMTI4LjQ4IDIxNS4xNSwgODUuMiAyMTUuMTUsIDAgMjE1LjE1IE0wIDIxNS4xNSBDMCAxNDEuNTYsIDAgNjcuOTcsIDAgMCBNMCAyMTUuMTUgQzAgMTU4LjA2LCAwIDEwMC45NywgMCAwIiBzdHJva2U9IiMxZTFlMWUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSI+PC9wYXRoPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1Ny4yMTA2NjExNjUyNzAwNCAxNy40NDg1Mzc5NDkyNTAyMzcpIHJvdGF0ZSgwIDM0Ljg4OTAxMjQyMzQyODU0IDE4Ljc4MTc4NTYyNjQ3ODQ2NykiPjx0ZXh0IHg9IjAiIHk9IjAiIGZvbnQtZmFtaWx5PSJWaXJnaWwsIFNlZ29lIFVJIEVtb2ppIiBmb250LXNpemU9IjMwLjA1MDg1NzAwMjM2NTU2OHB4IiBmaWxsPSIjMWUxZTFlIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHN0eWxlPSJ3aGl0ZS1zcGFjZTogcHJlOyIgZGlyZWN0aW9uPSJsdHIiIGRvbWluYW50LWJhc2VsaW5lPSJ0ZXh0LWJlZm9yZS1lZGdlIj5Cb29rPC90ZXh0PjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMi43MzUwNTM2MTI3MDcxMzQgNzYuNjEyOTk0NTM3NjQxMzgpIHJvdGF0ZSgwIDQwLjUwOTk2Mzk4OTI1NzgxIDYyLjUpIj48dGV4dCB4PSIwIiB5PSIwIiBmb250LWZhbWlseT0iVmlyZ2lsLCBTZWdvZSBVSSBFbW9qaSIgZm9udC1zaXplPSIyMHB4IiBmaWxsPSIjMWUxZTFlIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHN0eWxlPSJ3aGl0ZS1zcGFjZTogcHJlOyIgZGlyZWN0aW9uPSJsdHIiIGRvbWluYW50LWJhc2VsaW5lPSJ0ZXh0LWJlZm9yZS1lZGdlIj5jcmVhdGU8L3RleHQ+PHRleHQgeD0iMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJWaXJnaWwsIFNlZ29lIFVJIEVtb2ppIiBmb250LXNpemU9IjIwcHgiIGZpbGw9IiMxZTFlMWUiIHRleHQtYW5jaG9yPSJzdGFydCIgc3R5bGU9IndoaXRlLXNwYWNlOiBwcmU7IiBkaXJlY3Rpb249Imx0ciIgZG9taW5hbnQtYmFzZWxpbmU9InRleHQtYmVmb3JlLWVkZ2UiPnVwZGF0ZTwvdGV4dD48dGV4dCB4PSIwIiB5PSI1MCIgZm9udC1mYW1pbHk9IlZpcmdpbCwgU2Vnb2UgVUkgRW1vamkiIGZvbnQtc2l6ZT0iMjBweCIgZmlsbD0iIzFlMWUxZSIgdGV4dC1hbmNob3I9InN0YXJ0IiBzdHlsZT0id2hpdGUtc3BhY2U6IHByZTsiIGRpcmVjdGlvbj0ibHRyIiBkb21pbmFudC1iYXNlbGluZT0idGV4dC1iZWZvcmUtZWRnZSI+ZGVsZXRlPC90ZXh0Pjx0ZXh0IHg9IjAiIHk9Ijc1IiBmb250LWZhbWlseT0iVmlyZ2lsLCBTZWdvZSBVSSBFbW9qaSIgZm9udC1zaXplPSIyMHB4IiBmaWxsPSIjMWUxZTFlIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHN0eWxlPSJ3aGl0ZS1zcGFjZTogcHJlOyIgZGlyZWN0aW9uPSJsdHIiIGRvbWluYW50LWJhc2VsaW5lPSJ0ZXh0LWJlZm9yZS1lZGdlIj5maW5kQnlJZDwvdGV4dD48dGV4dCB4PSIwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJWaXJnaWwsIFNlZ29lIFVJIEVtb2ppIiBmb250LXNpemU9IjIwcHgiIGZpbGw9IiMxZTFlMWUiIHRleHQtYW5jaG9yPSJzdGFydCIgc3R5bGU9IndoaXRlLXNwYWNlOiBwcmU7IiBkaXJlY3Rpb249Imx0ciIgZG9taW5hbnQtYmFzZWxpbmU9InRleHQtYmVmb3JlLWVkZ2UiPmFsbDwvdGV4dD48L2c+PGcgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMC44MDgzODI2MTc0Njc0ODcgNjEuMzgyNzE3NDY4NTg3MTQ2KSByb3RhdGUoMCA4NS4yNDUzMTg4Njg2NjgxNiAtMC4xOTAyOTE4MTQ2NTcyMjkpIj48cGF0aCBkPSJNMCAwIEMyOC40MiAtMC4wNiwgMTQyLjA4IC0wLjMyLCAxNzAuNDkgLTAuMzggTTAgMCBDMjguNDIgLTAuMDYsIDE0Mi4wOCAtMC4zMiwgMTcwLjQ5IC0wLjM4IiBzdHJva2U9IiMxZTFlMWUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSI+PC9wYXRoPjwvZz48L2c+PG1hc2s+PC9tYXNrPjwvc3ZnPg==" />

E este é o código:

```javascript
import { AsyncDatabase } from "promised-sqlite3";

const db = await AsyncDatabase.open(
  // caminho para o arquivo do banco de dados SQLite
  process.env.DATABASE_URL
);

export class ActiveRecord {
  constructor({ database = db, tableName }) {
    this.database = database;
    this.tableName = tableName;
  }

  all(columns = "*") {
    const cols = Array.isArray(columns) ? columns.join(", ") : columns;

    return this.database.all(`SELECT ${cols} FROM ${this.tableName}`);
  }

  async findById(id, columns = "*") {
    const cols = Array.isArray(columns) ? columns.join(", ") : columns;
    const statement = await this.database.prepare(
      `SELECT ${cols} FROM ${this.tableName} WHERE id = $id`,
      { $id: id }
    );

    return statement.get();
  }

  async create(data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const statement = await this.database.prepare(
      `INSERT INTO ${this.tableName} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
      values
    );

    return statement.run();
  }

  async update(id, data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const statement = await this.database.prepare(
      `UPDATE ${this.tableName} SET ${columns.map((column) => `${column} = ?`).join(", ")} WHERE id = $id`,
      [...values, id]
    );

    return statement.run();
  }

  async delete(id) {
    const statement = await this.database.prepare(
      `DELETE FROM ${this.tableName} WHERE id = $id`,
      { $id: id }
    );

    return statement.run();
  }
}

export class Book extends ActiveRecord {
  constructor() {
    super({ tableName: "books" });
  }
}
```

<Alert title="Atenção" mb="md" color="yellow">
A implementação acima é apenas um exemplo didático. Não há preocupações com segurança ou validação de dados antes de inseri-los ou atualizar os dados no banco de dados.
</Alert>

Note que todo o SQL necessário para manipular os dados no nosso banco SQLite está encapsulado na classe `ActiveRecord`. Além disso, a classe `Book` herda todos os métodos da classe `ActiveRecord` e, portanto, não é necessário escrever o mesmo código para cada tabela do banco de dados. Desse modo, é possível criar várias entidades distintas no nosso sistema, como `Author`, `Publisher`, `Category`, `BookCategory`, `BookAuthor`, `BookPublisher`, etc. Todas elas herdam os métodos da classe `ActiveRecord` e, portanto, não é necessário escrever o mesmo código para cada tabela do banco de dados.

Mais que isso, podemos reimplementar os métodos da classe pai na classe filha, caso haja algum requisito especial para alguma entidade, como transformar o `delete` em um _soft delete_. Por exemplo:

```javascript
export class Book extends ActiveRecord {
  constructor() {
    super({ tableName: "books" });
  }

  async delete(id) {
    const statement = await this.database.prepare(
      // Não se esqueça de adicionar a coluna `deleted` na tabela `books`
      `UPDATE ${this.tableName} SET deleted = true WHERE id = $id`,
      { $id: id }
    );

    return statement.run();
  }
}
```

Este padrão pode resolver o nosso caso de uso, porém, como próprio Martin Fowler alerta, este padrão pode não ser o mais adequado para se aplicar em uma entidade que precisa se relacionar com um repositório (ou repositórios) de dados mais complexos (apesar de que Ruby on Rails [utiliza este padrão](https://guides.rubyonrails.org/active_record_basics.html) extensamente).

Se tiver alguma dúvida, comentário ou sugestão, deixe um comentário abaixo ou entre em contato comigo pelo [Twitter](https://twitter.com/douglasdemoura).

## Referências

- [Padrões de Projeto](https://engsoftmoderna.info/cap6.html#padr%C3%B5es-de-projeto)
- [Design patterns: elements of reusable object-oriented software](https://dl.acm.org/doi/book/10.5555/186897)
- [Patterns of Enterprise Application Architecture, by Martin Fowler](https://martinfowler.com/books/eaa.html)
