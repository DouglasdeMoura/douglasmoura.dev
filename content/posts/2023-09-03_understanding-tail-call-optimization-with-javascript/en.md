---
title: Understanding Tail Call Optimization With JavaScript
slug: understanding-tail-call-optimization-with-javascript
locale: en-US
created: 2023-10-24 15:13:38.216Z
updated: 2026-03-18 21:24:53.000Z
tags:
  - algorithms
  - javascript
  - mathematic
  - Node.js
cover: ./cover.jpg
---

Consider the following function that calculates the factorial of a number:

```javascript
const factorial = (n) => {
  let result = 1;

  while (n > 1) {
    result *= n;
    n--;
  }

  return result;
};
```

<aside data-alert data-color="blue" role="note">
<strong>Factorial</strong>
In Mathematics, the factorial of a non-negative integer (n!) is the product of all positive integers less than or equal to n.
</aside>

The function above was implemented iteratively, that is, it uses a loop to calculate the factorial of a number. However, it is possible to implement the same function recursively (that is, a function that references itself):

```javascript
const factorial = (n) => {
  if (n === 0) return 1;

  return n * factorial(n - 1);
};
```

The result of both functions is the same, however, the iterative function is [much more efficient](https://jsben.ch/1qyl8) (in JavaScript) than the recursive function. In addition, if we try to calculate the factorial of a very large number, we encounter the error RangeError: Maximum call stack size exceeded. Let's understand why this happens and how we can improve the recursive function.

## Call Stack

A [call stack](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack) is a data structure that stores information about a program's functions. When a function is called, it is added to the execution stack, as well as all the functions it calls. When a function returns, it is removed from the execution stack. Each function added to the stack is called a *stack frame*.

In order to understand what is happening, let's try to represent, graphically, how the calculation of the factorial of 6 is done with the iterative function:

<img src="./img/diagram-1.svg" alt="Iterative factorial computation of 6" />

Now, compare it with the substitution model for calculating the factorial of 6 using the recursive function:
<img src="./img/diagram-2.svg" alt="Recursive factorial computation of 6" />

Note that, in the iterative function, the arrow shape is linear and we can see the state of each variable at each step. In addition, at each iteration of our loop, a calculation is performed and the variables stored in memory are updated. In the recursive function, the arrow shape is exponential and we cannot see the state of all variables in the first half of the processing. In addition, each time the function is executed, more memory needs to be used to store the resulting values of each execution.

But what does this mean? In order for JavaScript to calculate the factorial of 6 using the iterative function, the `while` condition is added to the stack, where its calculation is performed, the `result` variable is updated, and then the executed code block of the `while` is removed from the stack. This is done until the while condition is false, that is, until the value of `n` is less than or equal to 1.

In the recursive function, each call to the `factorial` function is added to the stack as many times as necessary until the if condition is false, that is, until the value of `n` is less than or equal to 1. This means that, to calculate the factorial of 6, the `factorial` function is added to the stack 6 times before being executed. And that's why, when we try to calculate the factorial of a large number (100,000, for example), we encounter the error `RangeError: Maximum call stack size exceeded`: there is not enough space in the stack to store all the calls to the `factorial` function.

## Introducing Tail Call Optimization

As defined by [Dr. Axel Rauschmayer](https://dr-axel.de/):

> [...] whenever the last thing a function does is call another function, then this last function does not need to return to its caller. As a consequence, no information needs to be stored on the call stack and the function call is more like a goto (a jump). This type of call is called a *tail call*; not increasing the stack is called tail call optimization (TCO).

Now, we have discovered that our factorial calculation function is not tail recursive. But how can we make it tail recursive? With the help of another function:

```javascript
const factorial = (n) => {
  return factorialHelper(n, 1);
};

const factorialHelper = (x, accumulator) => {
  if (x <= 1) {
    return accumulator;
  }

  return factorialHelper(x - 1, x * accumulator);
};
```

Now, our function is tail recursive: the last thing it does is call a function (and not calculate an expression, as in the first implementation). Now, let's see the substitution model for calculating the factorial of 6 with our new `factorial` function:

<img src="./img/diagram-3.svg" alt="Tail-recursive factorial computation of 6" />

[The performance is superior](https://jsben.ch/vOf9P) to our first implementation, although it still doesn't beat the performance of the iterative function. However, we still encounter the error `RangeError: Maximum call stack size exceeded`. But why does this happen? Because, despite our function being tail recursive, current versions of Node.js and browsers ([with the exception of Safari](https://webkit.org/blog/6240/ecmascript-6-proper-tail-calls-in-webkit/)) do not implement Tail Call Optimization (despite its inclusion in the [EcmaScript](https://262.ecma-international.org/6.0/#sec-tail-position-calls) specification since 2015).

But how will we solve this problem? With the help of another function, of course! For that, we will rely on the [Trampoline](<https://en.wikipedia.org/wiki/Trampoline_(computing)>) pattern:

```javascript
const trampoline = (fn) => {
  while (typeof fn === "function") {
    fn = fn();
  }

  return result;
};
```

Our trampoline function consists of a loop that invokes a function that wraps another function (what we call a [thunk](https://en.wikipedia.org/wiki/Thunk)) until there are no more functions to execute. Let's see how the implementation of our factorial function would look like with the Trampoline pattern:

```javascript
const trampoline = (fn) => {
  while (typeof fn === "function") {
    fn = fn();
  }

  return fn;
};

const factorialHelper = (x, accumulator) => {
  if (x <= 1) {
    return accumulator;
  }

  // Now, a function returns another function
  return () => factorialHelper(x - 1, x * accumulator);
};

const factorial = (n) => {
  return trampoline(factorialHelper(n, 1));
};
```

And now, we can call our factorial function with a large number, without encountering the error `RangeError: Maximum call stack size exceeded`. Of course, depending on the factorial we want to calculate, we will encounter an Infinity, as it is a very large number (a number greater than Number.MAX_SAFE_INTEGER: 253 - <sup>1</sup>). In this case, we can use [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt):

```javascript
const trampoline = (fn) => {
  while (typeof fn === "function") {
    fn = fn();
  }

  return fn;
};

const factorialHelper = (x, accumulator) => {
  if (x <= 1) {
    return accumulator;
  }

  return () => factorialHelper(x - 1n, x * accumulator);
};

const factorial = (n) => {
  // Converting values to BigInt
  //-------------------------------\/----------\/
  return trampoline(factorialHelper(BigInt(n), 1n));
};
```

## Typing our function

And finally, let's add the necessary types to our factorial function:

```typescript
type Thunk = bigint | (() => Thunk);

const trampoline = (fn: Thunk) => {
  while (typeof fn === "function") {
    fn = fn();
  }

  return fn;
};

const factorialHelper = (x: bigint, accumulator: bigint): Thunk => {
  if (x <= 1) {
    return accumulator;
  }

  return () => factorialHelper(x - 1n, x * accumulator);
};

const factorial = (n: number) => {
  return trampoline(factorialHelper(BigInt(n), 1n));
};
```

## References

- [What happened to proper tail calls in JavaScript?](https://www.mgmarlow.com/words/2021-03-27-proper-tail-calls-js/)
- [Tail Call Optmization](https://exploringjs.com/es6/ch_tail-calls.html)
- [Limites da recursão em JavaScript, TCO e o pattern Trampoline](http://cangaceirojavascript.com.br/limites-recursao-javascript-tco-e-pattern-trampoline/)
- [What is an Activation object in JavaScript?](https://softwareengineering.stackexchange.com/a/189973/383960)
- [Factorial](https://mathworld.wolfram.com/Factorial.html)
- [Tail Recursion Explained - Computerphile](https://www.youtube.com/watch?v=_JtPhF8MshA)
- [Tail Call Optimization: The Musical!!](https://www.youtube.com/watch?v=-PX0BV9hGZY)
