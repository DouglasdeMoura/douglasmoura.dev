---
title: What is a first-class citizen in computer science?
slug: what-is-a-first-class-citizen-in-computer-science
locale: en-US
created: 2022-10-08 15:00:00.000Z
updated: 2022-12-29 14:51:27.174Z
tags:
  - javascript
  - computerscience
  - programming
  - beginners
cover: ./cover.jpg
---

In computer science, a **first-class citizen** is an entity that supports all operations available to other entities. Some of the available operations are:

- They may be named by variables;
- They may be passed as arguments to procedures;
- They may be returned as the results of procedures;
- They may be included in data structures.

It was the British computer scientist Christopher Strachey (1916-1975) [who first](https://link.springer.com/article/10.1023/A:1010052305354) coined this notion of first-class citizen status of elements in a programming language in the 1960s.

In JavaScript, for example, functions are first-class citizens, as all of the operations cited above can be applied to them. Let's see some examples:

**A simple function definition in JavaScript**

```javascript
function sum(a, b) {
  return a + b;
}
```

**Assigning a constant to a function**

```javascript
const sum = (a, b) => a + b;

// or
//
// const sum = function (a, b) {
//   a + b
// }
```

**Passing a function as an argument**

```javascript
function sum(a, b, callback) {
  const result = a + b;

  if (typeof callback === "function") {
    callback(result); // pass the result as an argument of `callback`
  }

  return result;
}

//        Pass `console.log` as the callback function
// -------\/
sum(2, 2, console.log); // => 4
```

**Return a function**

```javascript
function sum(a, b, callback) {
  const result = a + b;

  if (callback) {
    return () => callback(result);
  }

  return result;
}

//            The callback is the sum of the result with 2.
// ------------------\/
const fn = sum(2, 2, (result) => sum(2, result));
//    ^---- Store the returned function in a variable

//          Execute the function
// ---------\/
console.log(fn()); // => 6
```

**Including a function in a data structure**

```javascript
// Store the basic operations in an object
const operations = {
  sum: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
  div: (a, b) => a / b,
};
```
