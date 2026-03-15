---
title: Create beautiful placeholders for your images
slug: create-beautiful-placeholders-for-your-images
locale: en-US
created: 2022-09-29 15:00:00.000Z
updated: 2023-08-12 13:33:26.541Z
tags:
  - javascript
  - typescript
  - react
  - tutorial
cover: ./cover.jpg
---

Have you ever faced the situation where the layout of your beautifully crafted interface "breaks" if the image (depeding on the quality of your user's connections) takes some time to load? Something like the example below:

[<img src="https://media.giphy.com/media/Q7B0kOHlC7akJmwTCW/giphy.gif" />](https://media.giphy.com/media/Q7B0kOHlC7akJmwTCW/giphy.gif)

This happens because the browser has no clue about the dimensions of the image you want to display on your content beforehand.

The easiest way to solve this issue is using the [`aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) property to tell the browser how much space (based on the user's size display) it should reserve before the image is loaded. Check the difference:

```css
img {
  /* Makes all images responsive */
  width: 100%;
  height: auto;

  /*
  Here, I'm using the image's width and height,
  but you can come up with diference aspect ratios.
*/
  aspect-ratio: 760 / 235;
}
```

[<img src="https://media.giphy.com/media/X4dBoFehuhSrpUIdIA/giphy.gif" width="100%" />](https://media.giphy.com/media/X4dBoFehuhSrpUIdIA/giphy.gif)

So, it solves the sudden layout change, but we can do even better do better adding an animated background.

## Displaying an animated background

You can give a hint for the user that the blank space on your app should be filled with something by adding a background color or animating the transition between two o more colors, like in the example below:

<iframe height="300" style={{width:'100%'}} scrolling="no" title="Animated placeholder" src="https://codepen.io/douglasdemoura/embed/RwyWzEr?default-tab=" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/douglasdemoura/pen/RwyWzEr">
  Animated placeholder</a> by Douglas Moura (<a href="https://codepen.io/douglasdemoura">@douglasdemoura</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

And our code will look like this:

```css
:root {
  /*
  Set the default aspect ratio. You can change
  this CSS variable per class/id or event
  creating diferente classes.
  */
  --aspect-ratio: 16/9;
}

img {
  /* Makes all images responsive */
  width: 100%;
  height: auto;
}

/* Put all your images inside this container */
.image-container {
  aspect-ratio: var(--aspect-ratio);
  position: relative;
  animation: background-loading 0.8s linear infinite alternate;
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
}

/* The placeholder animation */
@keyframes background-loading {
  0% {
    background-color: #f9fafb;
  }
  100% {
    background-color: #d1d5db;
  }
}
```

And this is the result (check the code on [CodePen](https://codepen.io/douglasdemoura/pen/RwyWBOR)):

<img src="https://media.giphy.com/media/9yYPBL1X9wnAKzhVfE/giphy.gif" />

Yet, this can be even better by displaying a colorful background that matches the image colors.

## Displaying colorful image placeholders

[BlurHash](https://github.com/woltapp/blurhash) is a compact representation of a placeholder for a image. You use it to process your image before sending it to the browser and you'll get a string of 20-30 characters that the algorithm can turn into a blurred image that you can show to your user before the actual image is downloaded. Check how it looks like:

<img src="https://media.giphy.com/media/1RSpYFokgWI2tKRKHk/giphy.gif" />

I have implemented that last effect in React for the sake of simplicity and time, but you can re-implement it in whatever framework you like. Just pay attention to the `onLoad` event that changes the opacity of the image.

<iframe src="https://stackblitz.com/edit/vitejs-vite-enczef?embed=1&file=src/Image.module.css" height="500" style={{width: '100%'}} scrolling="no" title="Animated placeholder"  frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>
