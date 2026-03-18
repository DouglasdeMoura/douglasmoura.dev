---
title: Introduction to algorithms
slug: introduction-to-algorithms
locale: en-US
created: 2024-01-25 17:00:12.952Z
updated: 2026-03-18 21:24:53.000Z
tags:
  - Beginners
  - Computer Science
  - algorithms
cover: ./cover.jpg
type: post
---

## What is an Algorithm?

An algorithm is a precise and unambiguous specification of a sequence of computational steps that can be mechanically performed[^1]. From this, we can think of a function that receives a value or a set of values as input and returns a value or a set of values as its output.

An algorithm can be correct or incorrect. It is correct when, given its input parameters, its output is correct and, therefore, solves the computational problem for which it was developed. An incorrect algorithm, on the other hand, may stop with an incorrect output or may not stop at all for some input instances. Still, some incorrect algorithms can still have useful applications.

There can be different algorithms that solve the same problem, some more efficient, that is, faster than others. But, not every problem has an efficient solution. Such problems are known as <abbr title="Non-deterministic Polynomial time">NP</abbr>-complete.

<abbr title="Non-deterministic Polynomial time">NP</abbr>-complete problems are very interesting: even though no efficient algorithm has been found for this class of problems, it has not been proven that it is not possible to find an efficient algorithm (from class P, which can be solved in polynomial time) for such a problem. Moreover, if there were an efficient algorithm to solve an NP-complete problem, it would mean that there is an efficient algorithm for all <abbr title="Non-deterministic Polynomial time">NP</abbr>-complete problems.

<aside data-alert role="note">
<strong>P vs. NP</strong>
P vs. NP is a fundamental question in computer science, specifically in the field of computational complexity theory. It concerns the relationship between two classes of problems. The P class consists of decision problems (problems with a yes or no answer) that can be quickly solved (in polynomial time) by a deterministic computer, meaning that the time needed to solve the problem grows at a manageable rate as the size of the input increases. On the other hand, the NP class consists of decision problems for which, if a solution is provided, it can be quickly verified (also in polynomial time) by a deterministic computer.

The crucial question, "Is P equal to NP?", asks whether every problem whose solution can be quickly verified (NP) can also be solved quickly (P). This is profound because, if P were equal to NP, it would mean that all the problems that we can verify quickly can also be solved quickly. This has vast implications for various fields, including cryptography, optimization, and algorithm design.

</aside>

## Algorithmic Complexity

When we talk about algorithms, most of the time we are interested in the growth rate of time and space required to solve increasingly larger instances of certain problems. If we are interested in the time a particular algorithm takes to perform its function, we are interested in its time complexity. And the behavior of the time complexity limit of our algorithm in relation to the increase of the problem instances is called asymptotic time complexity. And it is this asymptotic complexity that determines the size of the problem that can be solved by algorithms[^2].

If an algorithm takes a time $cn^2$ for a constant $c$ to process an input of size $n$, we say that the complexity of the algorithm is of the order of $n^2$, or, in Bachmann–Landau notation (also called asymptotic notation and Big O notation), the algorithm has complexity $O(n^2)$.

To get a better idea of what this means in relation to the runtime of our algorithm, consider that one unit of time on the computer on which we run our algorithm is 1 millisecond. Now, we want to know what the maximum size of input that our algorithm can process within a certain time limit (one second, one hour, and one day). Note, in the table below, how much the complexity of the algorithm interferes with the maximum size of the input it can handle, given the time limit:

| Time Complexity | 1 second | 1 minute | 1 hour |
| --------------- | -------- | -------- | ------ |
| $n$             | 1000     | 60000    | 360000 |
| $n \log_2 n$    | 140      | 4895     | 204095 |
| $n^2$           | 31       | 244      | 1897   |
| $n^3$           | 10       | 39       | 153    |
| $2^n$           | 9        | 15       | 21     |

Even though we can build faster computers, the increase in the execution speed of less efficient algorithms would not be so significant, so we should always seek the most efficient algorithm to address a given problem.

[^1]: AHO, Alfred V.; ULLMAN, Jeffrey D. _Foundations of Computer Science_. Stanford, 1994.

[^2]: AHO, Alfred V.; HOPCROFT, John E.; ULLMAN, Jeffrey D. _The Design and Analysis of Computer Algorithms_. Addison-Wesley, 1974.
