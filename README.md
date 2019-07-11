# leniwiec.js

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
// Create instance...
const leniwiec = new Leniwiec('.leniwiec', customConfig);

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

```
// Class instance
const leniwiec = new Leniwiec();

// Activation of the class
leniwiec.mount();

// Addition of a new element for observation by the class
leniwiec.observe(element);
```
