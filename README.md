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
// elements - string selector, NodeList, HTMLElement, Node, HTMLElement[] or Node[]
new Leniwiec(elements, config);
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
  // The src argument is passed only to elements with the data-load-image attribute
  onLoad: (element, src) => { 
    console.log(src); // loaded src path
    console.log(element); // loaded target element
  }, 

  // Callback fired on error when loading the image
  onError: target => { console.log(target) }, // unloaded target element
}
```

## Methods

```javascript
// Addition of a new element for observation by the class
// element - HTMLElement
leniwiec.observe(element);

// Immediately unobserve all elements
leniwiec.unmount();

// Load all elements immediately
leniwiec.loadAll();
```

## Examples

```html
<div class="leniwiec" data-background-image="//via.placeholder.com/300x150"></div>

<img class="leniwiec" data-src="//via.placeholder.com/300x150"></div>

<picture class="leniwiec" data-src="//via.placeholder.com/1000x320">
	<source media="(min-width: 1000px)" srcset="//via.placeholder.com/1000x1000" />
</picture>
```

## Progressive Images Loading Example

```html
<div class="js-progressive" data-load-image="big-image.jpg">
	<div class="js-small" style="background-image:url(small-image.jpg)"></div>
	<div class="js-big"></div>
</div>
```

```js
new Leniwiec(document.querySelectorAll('.js-progressive'), {
	onLoad: (target, src) => {
		target.querySelector('.js-big').style.backgroundImage = `url(${src})`;
	}
});
```

## License

[MIT](LICENSE) © [Przemysław Tyczyński](https://tyczynski.pl)
