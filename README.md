# Storybook Addon Perfect Design

This addon helps develop your components with pixel perfect accuracy!
It allows you put a semi-transparent image overlay over the top of
the developed component and perform pixel-to-pixel comparison
between them.

## Keyboard shortcuts

* \[Shift + Arrow keys] for 10px position change
* \[Alt + Shift + Arrow keys] for 0.1px position change

## Getting Started

Requires Storybook 6.1 or later. Install the latest with `npx sb upgrade --prerelease`

First, install the addon

```sh
npm i -D storybook-addon-perfect-design
```

Then, add following content to [`.storybook/main.js`](https://storybook.js.org/docs/react/configure/overview#configure-your-storybook-project):

```js
module.exports = {
  addons: ['storybook-addon-perfect-design']
};
```


### Usage

Within your stories:

```js
import React from 'react';

import imageUrl from './images/my-image.jpg'; 

export default {
  title: 'Design Assets',
  parameters: {
    assets: [
      imageUrl, // link to a file imported
      'https://via.placeholder.com/300/09f/fff.png', // link to an external image
      'https://www.example.com', // link to a webpage
      'https://www.example.com?id={id}', // link to a webpage with the current story's id in the url
    ],
  },
};

export const defaultView = () => (
  <div>your story here</div>
);
```