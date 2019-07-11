# leniwiec.js [![npm version](https://badge.fury.io/js/leniwiec.svg)](https://badge.fury.io/js/leniwiec) [![](https://data.jsdelivr.com/v1/package/npm/leniwiec/badge?style=rounded)](https://www.jsdelivr.com/package/npm/leniwiec) [![](https://img.shields.io/npm/l/leniwiec.svg)](https://github.com/tyczynski/leniwiec.js/blob/master/LICENSE)

A lightweight library for lazy loading of images based on the IntersectionObserver API.

## Install

```sh
# Install with npm...
$ npm install --save leniwiec

# ...or you can use yarn
$ yarn add leniwiec
```

## Usage
```javascript
// Import package...
import Leniwiec from 'leniwiec';

// ...create instance...
const leniwiec = new Leniwiec();

// ...and mount it
leniwiec.mount();
```

## Options

```javascript
{
  // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
	root: null,
	rootMargin: '0px',
	threshold: 0,

  // Class name added for unloaded images
	errorClassName: 'is-error',

  // Class name added for loaded images
	loadedClassName: 'is-loaded',

  // Callback fired after loading the image
	onLoad: element => { console.log(element) }, // loaded element

  // Callback fired on error when loading the image
	onError: element => { console.log(element) }, // unloaded element
}
```

## Methods

```javascript
// Activation of the class
leniwiec.mount();

// Addition of a new element for observation by the class
leniwiec.observe(element);
```

## Examples

```html
<div class="leniwiec" data-background-image="//via.placeholder.com/300x150"></div>

<img class="leniwiec" data-src="//via.placeholder.com/300x150"></div>

<picture class="leniwiec" data-src="//via.placeholder.com/1000x320">
	<source media="(min-width: 1000px)" srcset="//via.placeholder.com/1000x1000" />
</picture>
```

## License

[MIT](LICENSE) © [Przemysław Tyczyński](https://tyczynski.pl)
