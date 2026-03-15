---
title: How to extend HTML elements with React
slug: how-to-extend-html-elements-with-react
locale: en-US
created: 2022-09-26 00:00:00.000Z
updated: 2022-12-29 14:51:44.872Z
tags:
  - javascript
  - typescript
  - react
cover: ./cover.jpg
---

Most of the work needed to create custom HTML elements that fit the design system of your company resides styling and adding your own props. So, let's say you have to create a custom `Button`, that should receive a `children` prop and should have DOM access via [ref](https://reactjs.org/docs/refs-and-the-dom.html). That's how you can do it:

```typescript
import { forwardRef } from 'react';

type ButtonProps = {
  loading?: boolean; // custom prop
} & React.PropsWithChildren<React.ComponentPropsWithRef<'button'>>;

const Button: React.FC<ButtonProps> = forwardRef(
  ({ loading, children, ...props }, ref) => {
    return (
      <button data-loading={loading} {...props} ref={ref}>
        {children}
      </button>
    );
  }
);

export default Button;
```

We use the [`PropsWithChildren`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/d076add9f29db350a19bd94c37b197729cc02f87/types/react/index.d.ts#L822) generic interface that gives the `children` prop and receive `React.ComponentPropsWithRef<'button'>`, that passes all props that a [`button`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) can receive.

Of course, you can change the interface [`ComponentPropsWithRef`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/d076add9f29db350a19bd94c37b197729cc02f87/types/react/index.d.ts#L834) for [`ComponentPropsWithoutRef`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/d076add9f29db350a19bd94c37b197729cc02f87/types/react/index.d.ts#L838) and drop the [`forwardRef`](https://reactjs.org/docs/forwarding-refs.html) function on the definition of your component (although, I do not recomend it - _refs_ may be useful later on your application):

```typescript
type ButtonProps = {
  loading?: boolean; // custom prop
} & React.PropsWithChildren<React.ComponentPropsWithoutRef<'button'>>;

const Button: React.FC<ButtonProps> = ({ loading, children, ...props }) => {
  return (
    <button data-loading={loading} {...props} ref={ref}>
      {children}
    </button>
  );
};

export default Button;
```

You may, even, drop the interface `PropsWithChildren`, but on doing that, you'd have to implement the `children` prop by yourself:

```typescript
type ButtonProps = {
  loading?: boolean; // custom prop
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<'button'>;

const Button: React.FC<ButtonProps> = ({ loading, children, ...props }) => {
  return (
    <button data-loading={loading} {...props} ref={ref}>
      {children}
    </button>
  );
};

export default Button;
```

Want more? Check the live implementation on [StackBlitz](https://stackblitz.com/edit/vitejs-vite-warc15?file=src%2Fcomponents%2Fbutton.tsx&terminal=dev)
