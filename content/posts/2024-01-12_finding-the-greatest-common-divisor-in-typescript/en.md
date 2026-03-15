---
title: Finding the greatest common divisor in TypeScript
slug: finding-the-greatest-common-divisor-in-typescript
locale: en-US
created: 2024-01-12 16:31:36.266Z
updated: 2024-01-25 13:55:08.252Z
tags:
  - typescript
  - mathematic
  - javascript
cover: ./cover.jpg
type: post
---

First described in the classic geometry book _Elements_, by the ancient Greek mathematician Euclid (ca. 300 BC, at the book VII, proposition 2), the method of finding de greatest common divisor between the positive numbers $a$ and $b$, being $a > b$ consists on the knowledge that the common divisors of $a$ and $b$ are the same of $a - b$ and $b$. Therefore, we can find this greatest common divisor by replacing the largest number ($a$) by the different between the two numbers ($a - b$), repeatedly, until the two numbers are equal. In TypeScript, we can do that like this:

```typescript
const gcd = (a: number, b: number): number => {
  // When `a` is equal to `b`, return the result
  if (a === b) {
    return a;
  }

  // When `a` is bigger than b, calculate the the GCD again
  // with the new `a` being `a - b`.
  if (a > b) {
    return gcd(a - b, b);
  }

  // If the new `b` is bigger than `a`,
  // subtract a from it.
  return gcd(a, b - a);
};
```

This method can be very slow if the difference between $a$ and $b$ is too large. Thankfully, there's another method to find the greatest common divisor between two numbers, that can be described as follows:

1. In order to find the greatest common divisor between $a$ and $b$, being $a > b$, perform the division between the two numbers. This operation will give a quotient and a remainder (that we will call $q$ and $r$, respectively). Thus, $a$ can be described as $a = q \times b + r$;
2. If $r$ is equal to 0, we stop, because we found that the greatest common divisor of $a$ and $b$ is $b$. Otherwise, we go back to step 1, making $b$ the new $a$ and $r$ will be the new $b$.

Now, we can start with the implementation of the algorithm above:

```typescript
const gcd = (a: number, b: number): number => {
  // First, we take the remainder between the division of a and b:
  const r = a % b;

  // If the remainder is equal to zero, it means that we already found the
  // greatest common divisor, therefore, we return b:
  if (r === 0) {
    return b;
  }

  // If the remainder is not equal to 0, we call the function again
  // with the new values for a and b:
  return gcd(b, a % b);
};
```

The implementation is very straightforward and can be read exactly as is described in steps 1 and 2. We can make the function simpler, by checking, directly, if $b$ is equal to zero and only doing the remainder operation afterwards. Therefore, if the function receive a $b$ that is equal to zero, we will know that $a$ is the greatest common divisor:

```typescript
const gcd = (a: number, b: number): number => {
  if (b === 0) {
    return a;
  }

  return gcd(b, a % b);
};
```

This variant is called _Euclidean algorithm_ (in contrast of the first one, which is the _Euclid's algorithm_) and it significantly faster than the first implementation.

## Alternative implementations

We can also take a different approach. Instead of calling our `gcd` function recursively, we can implement our function using a `while` loop (analogous to our first implementation above):

```typescript
const gcd = (a: number, b: number): number => {
  // Run this loop while a is different of b
  while (a !== b) {
    if (a > b) {
      // Subtracts b from a while a is bigger than b
      a = a - b;
      // Go to the next loop
      continue;
    }
    // Subtracts a from b when a <= b
    b = b - a;
  }
  // Returns the greatest common divisor between a and b
  return a;
};
```

And this is another way (analogous to our second implementation above):

```typescript
const gcd = (a: number, b: number): number => {
  // Run this loop while `b` is different from 0
  while (b !== 0) {
    // Save the new value for a in a temporary variable
    const newA = b;
    // Set b to the modulo of a and b (the remainder of the division between a and b)
    b = a % b;
    // Set a to its new value before the next loop
    a = newA;
  }

  // Now that b is equal to 0, we know that a is the greatest common divisor
  return a;
};
```

## Finding the greatest common between three or more numbers

The greatest of three or more numbers is equal the product of the prime factors common to all the numbers (we will explore more of that in a future article), but, you can also calculate the greatest common divisor between pairs of this list of numbers with the same functions we have showed already. So, let's refactor our `gcd` function to receive multiple parameters:

```typescript
const gcd = (...numbers: number[]): number => {
  const calculateGcd = (a: number, b: number): number => {
    if (b === 0) {
      return a;
    }

    return calculateGcd(b, a % b);
  };

  return (
    numbers
      // Just to be sure, sort numbers in descendant order:
      .sort((a, b) => b - a)
      // Call `calculateGcd` for each pair in the numbers array:
      .reduce((a, b) => calculateGcd(a, b))
  );
};
```

## Validating our input

Let's guarantee that our functions should always receive, at least, two numbers and that all numbers must not be negative:

```typescript
const gcd = (...numbers: number[]): number => {
  if (numbers.length < 2) {
    throw new Error("You must pass, at least, 2 numbers");
  }

  if (numbers.some((number) => number < 0)) {
    throw new Error("The numbers must be >= 0");
  }

  const calculateGcd = (a: number, b: number): number => {
    if (b === 0) {
      return a;
    }

    return calculateGcd(b, a % b);
  };

  return (
    numbers
      // Just to be sure, sort numbers in descendant order:
      .sort((a, b) => b - a)
      // Call `calculateGcd` for each pair in the numbers array:
      .reduce((a, b) => calculateGcd(a, b))
  );
};
```
