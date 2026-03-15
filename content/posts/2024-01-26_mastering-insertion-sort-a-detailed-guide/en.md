---
title: "Mastering Insertion Sort: A Detailed Guide"
slug: mastering-insertion-sort-a-detailed-guide
locale: en-US
created: 2024-01-26 23:06:53.913Z
updated: 2024-01-26 23:06:53.913Z
tags:
  - algorithms
  - computerscience
  - tutorial
cover: ./cover.jpg
type: post
---

Sorting is a fundamental operation in the field of computer science, and because of this, there are various algorithms available to solve this problem. Each one is chosen based on factors such as the number of items to sort, the degree of order already present, the computer architecture where the algorithm will be executed, the type of storage device, among others. In this article, we will explore the insertion sort algorithm, understanding its nuances, strengths, and limitations.

## What is insertion sort?

Insertion sort is a comparison-based algorithm that constructs its output one element at a time. It works similarly to the method we use to sort a deck of cards: we take one card at a time, compare it with the ones we already have in our hand, place the card in the correct position, and repeat this action until we finish our deck.

It is an adaptive algorithm, meaning it is efficient for small data sets, as well as other quadratic complexity algorithms ($O(n^2)$). It is simple to implement, requires a constant amount of memory, as changes in the list are made in the list itself (without the need to create a new list, which would double the use of memory), and is capable of sorting the list as it receives it.

## How does insertion sort work?

**Initialization:** We assume that the first element of our list is already sorted. We proceed to the next element, consider it as our key, and insert it in the correct position in the sorted part of the list;

**Iteration:** For each item in the list (starting from the second element), we store the current item (key) and its position. Then we compare the key with the elements in the sorted part of the list (elements before the key);

**Insertion:** If the current element in the sorted part is greater than the key, we move that element one position up. This creates space for the new key to be inserted;

**Repositioning the Key:** We continue moving elements one position up until we find the correct position for the key. This position is found when we encounter an element that is less than or equal to the key or when we reach the beginning of the list;

**Repeat:** The process is repeated for all the elements in the list.

## Implementation in JavaScript

To better understand the algorithm, let's implement it in JavaScript:

```js
/**
 * Sorts an array of numbers using the insertion sort algorithm.
 *
 * @param  {number[]}  numbers - The list of numbers to be sorted.
 * @returns  {number[]} - The sorted list of numbers.
 */
function insertionSort(numbers) {
  for (let i = 1; i < numbers.length; i++) {
    const key = numbers[i];
    let j = i - 1;

    while (j >= 0 && numbers[j] > key) {
      numbers[j + 1] = numbers[j];
      j--;
    }

    numbers[j + 1] = key;
  }
}
```

## Complexity Analysis

### Time Complexity

**Best Case (Array is already sorted):** $O(n)$. This is because the inner loop (while) is not executed at all;
**Average Case and Worst Case (Array is sorted in reverse order):** $O(n^2)$. In the worst case, each iteration will cause an element to be moved. This makes the algorithm inefficient for large data sets.

## Space Complexity

**Space Complexity:** $O(1)$. Insertion sort is an in-place algorithm; it requires a constant amount of memory space.
