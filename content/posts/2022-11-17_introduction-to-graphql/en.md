---
title: Introduction to GraphQL
slug: introduction-to-graphql
locale: en-US
created: 2022-11-17 15:00:00.000Z
updated: 2022-12-29 14:51:23.352Z
tags:
  - graphql
  - webdev
cover: ./cover.jpg
---

[GraphQL](https://graphql.org/) is a query language for APIs and a runtime for fulfilling those queries with your existing data, developed by Facebook in 2012 and open sourced in 2015. The goal was to create a query language that allowed fine-grained control over the needed data a client can request to an API server.

A GraphQL service is created by defining **types** and **fields** to those types in a **schema**. A commom way to defining the schema of your GraphQL service is through the GraphQL Schema Definition Language (SDL).

In this article, I'll show how to create a GraphQL schema compliant with the [Relay GraphQL Server](https://relay.dev/docs/guides/graphql-server-specification/) specification.

## Defining your schema in GraphQL

A GraphQL schema should informe the users about all the types and objects that can be queried and mutated on the graph. GraphQL even provides a feature to query metadata about those types and objects, which can be used to document the GraphQL.

Let's define a simple schema using GraphQL SDL (Schema Definition Language):

```graphql
"""
Serialize and validate JavaScript dates.
"""
scalar Date

"""
Node interface
"""
interface Node {
  id: ID!
}

"""
Priority level
"""
enum Priority {
  LOW
  MEDIUM
  HIGH
}

"""
A task that the user should complete
"""
type Task implements Node {
  "Task ID"
  id ID! # ID is a GraphQL special type for IDs.
  "Task title"
  title String!
  "Task creation date"
  created: Date!
  "Task modification date"
  modified: Date
  priority: Priority!
}

"""
Needed input data to add a new task.
"""
input AddTaskInput {
  title: String!
  priority: Priority
}

type Query {
  "Get a task by ID"
  task(id: ID!): Task
}

type Mutation {
  addTask(input: AddTaskInput): Task
}
```

1. First we define a [custom Date scalar](https://graphql.org/learn/schema/#scalar-types) that should validate and serialize Date objects;
2. We define a `Node` interface. I'll explain more on why I'm defining this interface the next topic;
3. We define an [enumeration type](https://graphql.org/learn/schema/#enumeration-types) to define the valid priority status of a task;
4. We create our `Task` type with all the field it should contain. Notice that all field with the exclamation mark at the end are obligatory;
5. We add an input called `AddTaskInput` that defines the obligatory data to add a new `Task`;
6. In the Query type (which is a GraphQL reserved type), we define what queries are available from our root object;
7. In the Mutation type (which is a GraphQL reserved type), we define which operations to alter our data are available. Such operations are called [mutations](https://graphql.org/learn/queries/#mutations).

Notice that, in GraphQL, comments between quotes serve as documentation (it'll be parsed and displayed in your GraphiQL web documentation interface), while the comments that start with `#` are ignored.

## Querying your data in GraphQL

Tipically, you'd query a GraphQL server like this:

```graphql
{
  task(id: "2") {
    title
  }
}
```

Which would return the following, in JSON format:

```json
{
  "data": {
    "task": {
      "title": "Write GraphQL tutorial"
    }
  }
}
```

In the query above, we started with a special "root" object, from where we select the `task` field with the id equals to `2` Then, we select the `title` field from the `task` object. But, if no task has an id equals to 2? In this case, our response would be:

```json
{
  "data": {
    "task": null
  }
}
```

Or, in case of a error, we would receive this response:

```json
{
  "data": {
    "task": null
  },
  "errors": [
    {
      "message": "Internal server error."
    }
  ]
}
```

You may want rename a field before using your data. Well, you can create your [aliases](https://graphql.org/learn/queries/#aliases) just like this:

```graphql
{
  todo: task(id: "2") {
    name: title
  }
}
```

And that would be the return:

```json
{
  "data": {
    "todo": {
      "name": "Write GraphQL tutorial"
    }
  }
}
```

GraphQL also provides the feature of create [query fragments](https://graphql.org/learn/queries/#fragments) and setting up [directives](https://graphql.org/learn/queries/#directives) to query your data. I'll need to add more complexity to our current schema in order to explain that, so, for while, let's move to the next topic.

## The Relay GraphQL Server specification

Despite you may not want to use [Relay](https://relay.dev/) (or even React) to consume your GraphQL data, their specification is very useful and provides a common ground of what developers should expect from a GraphQL server.

Remember that `Node` interface we defined above? Its purpose is to provide a [global object identification](https://graphql.org/learn/global-object-identification/) for all the GraphQL nodes in our server. Therefore, a GraphQL client can handle re-fetching and caching in a more standardized way. Notice that each ID must be globally unique on your application.

As the `Node` interface will be used for all objects in our server, GraphQL provides a reusable unit called [fragment](https://graphql.org/learn/queries/#fragments). Now, let's add a new way the query nodes on our schema:

```graphql
# ...

type Query {
  "Get a node by ID"
  node(id: ID!): Node
}

# ...
```

Notice that the `task` query was removed, as it is no more needed. And now, we will re-do our query using a fragment:

```graphql
# We name the query and pass a variable
# to improve the development experience.
query getTask(id: ID!) {
  node(id: $id) {
    ...taskFields
  }
}

fragment taskFields on Task {
  title
}
```

And now, we will change our schema to comply with the Relay GraphQL Server specification. Take some time to read the comments in order to understand what is being done here.

```graphql
"""
Serialize and validate JavaScript dates.
"""
scalar Date

"""
Node interface
"""
interface Node {
  id: ID!
}

"""
Priority level
"""
enum Priority {
  LOW
  MEDIUM
  HIGH
}

"""
A task that the user should complete
"""
type Task implements Node {
  "Task ID"
  id ID! # ID is a GraphQL special type for IDs.
  "Task title"
  title String!
  "Task creation date"
  created: Date!
  "Task modification date"
  modified: Date
  priority: Priority!
}

"""
Define an edge of the task,
containing a node and a pagination cursor.
"""
type TaskEdge {
  cursor: String!
  node: Task
}

"""
Define a connection between the
task edges, including the PageInfo
object for pagination info.
"""
type TaskConnection {
  edges: [TaskEdge] # Yes, we use brackets to define arrays in GraphQL
  pageInfo: PageInfo!
}

"""
Provides pagination info
for a cursor-based pagination
"""
type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

"""
Needed input data to add a new task.
"""
input AddTaskInput {
  title: String!
  priority: Priority
}

type Query {
  node(id: ID!): Node
  tasks(
    first: Int, # The amount of tasks requested
    after: String # Cursor to mark the point
  ): TaskConnection
}

type Mutation {
  addTask(input: AddTaskInput): Task
}
```

At this point, the metaphor of [graphs](<https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)>) used here should be very clear. Each **edge** of your graph has a node and a **connection** of edges has a collection of nodes that can be paginated. Note that, in this specification, is expected that you implement a [cursor based pagination](https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination), rather than a [offset pagination](https://www.prisma.io/docs/concepts/components/prisma-client/pagination#offset-pagination) (follow the previous link to have more information about their differences.

And that's all we need to comply with the [Relay GraphQL Server Specification](https://relay.dev/docs/guides/graphql-server-specification/).

In the next article, I'll implement a GraphQL server using all the concepts that we learned here.

Source:

[GraphQL](https://graphql.org/)
