---
title: Increase YouTube video playback rate up to 2x
slug: increase-youtube-video-playback-rate-up-to-2x
locale: en-US
created: 2020-10-25 00:00:00.000Z
updated: 2022-12-29 14:52:21.704Z
tags:
  - javascript
  - html
  - video
  - youtube
cover: ./cover.jpg
---

YouTube videos (along with all modern video implementations on the web) uses the [HTML5 video element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). This new media tag implements the [HTMLMediaElement API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement), which gives a plenty of media-related methods common to audio and video.

The standard YouTube player just allow us to increase video speed up to 2x, but, if you want to increase it even more? Well, there's a solution for that: just set the playback rate to whatever number you want!

In order to do that, you need to select the `<video>` element in the page and change its playback rate to the desired speed:

```js
document.getElementsByTagName("video")[0].playbackRate = 2.5;
```

It's a good solution, but not a practical one. Gracefully, there's a better way to make use of this functionality without having to open the console of your browser.

## JavaScript bookmarklet

<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/i/hjvcu6sqxp24u5emozsb.png" alt="Adding the bookmarklet on Firefox" />
  <figcaption>
    Adding the bookmarklet on Firefox
  </figcaption>
</figure>

If you want to have this script always at hand, the best way is to put it inside a JavaScript [bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet). Just create a new bookmark in you favorite browser and add the code below:

```js
javascript: (function () {
  const rate = prompt("Set the new playback rate", 2.5);
  if (rate != null) {
    const video = document.getElementsByTagName("video")[0];
    video.playbackRate = parseFloat(rate);
  }
})();
```

And here is an screenshot of the bookmarklet working:

<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/i/erxbc4xcxdk7v0gun8z1.png" alt="Video speed bookmarklet working" />
  <figcaption>
    Changing the speed of an (awesome) <a href="https://www.youtube.com/watch?v=G4MvFT8TGII">YouTube video</a>
  </figcaption>
</figure>

Feel free to contribute with this code in <a href="https://gist.github.com/DouglasdeMoura/052456a93f93d47982ccb5eefc602eb1" target="_blank">my public gist</a>.
