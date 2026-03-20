---
title: How to calculate the border-radius of nested elements
slug: how-to-calculate-the-border-radius-of-nested-elements
locale: en-US
created: 2023-08-30 18:47:17.057Z
updated: 2026-03-20 19:22:04.000Z
tags:
  - CSS
  - HTML
cover: ./cover.jpg
---

The [`border-radius`](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) property allows you to round the edges of an element. Giving the same `border-radius` value to the parent element and child element doesn't result in the best appearance, so how do you calculate the border radius of nested elements?

Check out the demo below:

<iframe height="350" style="width:100%" title="CodePen: nested border-radius demo" src="https://codepen.io/douglasdemoura/embed/KKbzrER" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>

In the example above, the two circles have the same radius and are inscribed in squares with rounded edges. Note that the radius of the border is the same as the radius of the circle. We want the end of the arc of the circle each edge starts to be coincident with both squares. This can be done in two ways:

1. Radius of the border of the inner square (R<sub>i</sub>) + spacing between squares (E) = radius of the border of the outer square (R<sub>e</sub>);
2. Outer square border radius (R<sub>e</sub>) - spacing between squares (E) = inner square border radius R<sub>i</sub>.

Note that the center of the circles inscribed in the squares do not coincide, as well as the end of the border arc. Still, the result is satisfactory.

## Bonus

In this interactive example, made by [Jhey Tompkins](https://jhey.dev/), you can see how this rule applies in practice:

<iframe height="350" style="width:100%" title="CodePen: nested border-radius by Jhey" src="https://codepen.io/jh3y/embed/KKrYaxx" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>

## References

- [@jh3yy](https://twitter.com/jh3yy/status/1688542283602231296)
- [Tip: Perfect nested border radius in CSS](https://www.30secondsofcode.org/css/s/nested-border-radius/)
- [CSS3 border-radius Property](https://www.w3schools.com/cssref/css3_pr_border-radius.asp)
- [CSS Backgrounds and Borders Module Level 3](https://www.w3.org/TR/css-backgrounds-3/#corners)
