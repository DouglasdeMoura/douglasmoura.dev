---
title: Creating native modals with the dialog element
slug: creating-native-modals-with-the-dialog-element
locale: en-US
created: 2023-08-13 19:29:49.318Z
updated: 2026-03-18 21:28:39.000Z
tags:
  - html
  - javascript
  - tutorial
cover: ./cover.jpg
---

Using custom dialog elements instead of native browser implementations, such as [`alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert),
[`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm), or [`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt),
has become the standard for web development for quite some time (popularized by various [jQuery](https://jqueryui.com/dialog/) plugins and by [Bootstrap](https://getbootstrap.com/2.3.2/javascript.html#modals) itself), so that with every new UI library that emerges[^1][^2][^3], it is common for its authors to re-implement a modal with the framework of the moment (which may or may not implement [WAI-ARIA accessibility](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)).

[^1]: [Material UI Modal](https://mui.com/material-ui/react-modal/)

[^2]: [Ant Design Modal](https://ant.design/components/modal)

[^3]: [Carbon Design System Modal](https://carbondesignsystem.com/components/modal/usage/#live-demo)

But now, with the arrival of the [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) element in HTML5 (supported by [93.85%](https://caniuse.com/dialog) of browsers in use), it is much easier to create dialogs natively. In this article, we will see how to create a simple modal (and non-modal) dialog with the `<dialog>` element.

## Understanding the _dialog_ element

In the sense employed in user interface development, a **dialog** is a <q>conversation</q> between the system and the user, where the system expects a response from the user to continue. A dialog can be **modal** or **non-modal**. A modal dialog (that is, one that changes the **mode** of interaction of the user with the system) is one that locks the interface, preventing the user from interacting with the rest of the page until it is closed. A non-modal dialog (that is, one that _does not_ change the **mode** of interaction of the user with the system), on the other hand, allows the user to interact with the rest of the page while the dialog is open.

The simplest way to put a non-modal dialog on the screen is as follows:

```html
<dialog open>
  <p>Olá, mundo!</p>
  <form method="dialog">
    <button>Fechar</button>
  </form>
</dialog>
```

Note the form, on line 5, with the _dialog_ method. It is this form that sends actions to the `dialog`. It will be displayed like this:

<iframe height="350" style="width:100%" src="https://codepen.io/douglasdemoura/embed/zYMgBOz" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>

What makes the example above a non-modal dialog is the use of the `open` attribute (line 1), which also makes it unable to be closed with the `Esc` key. It's possible to create a non-modal dialog using the JavaScript API:

<iframe height="350" style="width:100%" src="https://codepen.io/douglasdemoura/embed/BaGXqjx" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>

In order for it to behave like a modal, it is necessary to open it through its JavaScript API, as we will see next.

<iframe height="350" style="width:100%" src="https://codepen.io/douglasdemoura/embed/VwVojZB" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>

This time, we open and close the modal with JavaScript and put the form result in the `output` element when the modal is closed. Read the code carefully and try to understand what is happening.

## Styling the modal

The `dialog` element can (of course), be styled like any other HTML element. However, note that, to style the overlay (the dark background behind the modal), it is necessary to use the `::backdrop` selector:

<iframe height="350" style="width:100%" src="https://codepen.io/douglasdemoura/embed/gOQVMYE" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>

## Polyfill

If you want to use `dialog` and don't have compatibility issues in older browsers, you can use this [polyfill](https://github.com/GoogleChrome/dialog-polyfill).

<hr />

<h3>References</h3>

- [Dialog](https://web.dev/learn/html/dialog/)
- [Dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [Modal & Nonmodal Dialogs: When (& When Not) to Use Them](https://www.nngroup.com/articles/modal-nonmodal-dialog/)
