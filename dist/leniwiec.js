/**
 * @package leniwiec - A lightweight library for lazy loading of images based on the IntersectionObserver API.
 * @version v1.0.1
 * @link https://github.com/tyczynski/leniwiec.js
 * @author Przemysław Tyczyński | https://tyczynski.pl
 * @license MIT
 */
function _extends() {
	_extends =
		Object.assign ||
		function(target) {
			for (var i = 1; i < arguments.length; i++) {
				var source = arguments[i];
				for (var key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key];
					}
				}
			}
			return target;
		};
	return _extends.apply(this, arguments);
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError('Cannot call a class as a function');
	}
}

function _defineProperties(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ('value' in descriptor) descriptor.writable = true;
		Object.defineProperty(target, descriptor.key, descriptor);
	}
}

function _createClass(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties(Constructor, staticProps);
	return Constructor;
}

function _typeof(obj) {
	if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
		_typeof = function _typeof(obj) {
			return typeof obj;
		};
	} else {
		_typeof = function _typeof(obj) {
			return obj &&
				typeof Symbol === 'function' &&
				obj.constructor === Symbol &&
				obj !== Symbol.prototype
				? 'symbol'
				: typeof obj;
		};
	}
	return _typeof(obj);
}

(function(global, factory) {
	(typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' &&
	typeof module !== 'undefined'
		? (module.exports = factory())
		: typeof define === 'function' && define.amd
		? define(factory)
		: (global.Leniwiec = factory());
})(this, function() {
	'use strict';
	/**  @const {Object} defaultConfig default class configuration */

	var defaultConfig = {
		root: null,
		rootMargin: '0px',
		threshold: 0,
		errorClassName: 'is-error',
		loadedClassName: 'is-loaded',
		onLoad: function onLoad() {},
		onError: function onError() {},
	};
	/**
	 * Check if the user is a robot
	 *
	 * @return {bool}
	 */

	function isRobot() {
		var isBrowser = typeof window !== 'undefined';
		return (
			(isBrowser && !('onscroll' in window)) ||
			(typeof navigator !== 'undefined' &&
				/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent))
		);
	}
	/**
	 * Checks whether the passed parameter is an Element or HTMLElement
	 *
	 * @param {*} param
	 * @return {bool}
	 */

	function isElement(param) {
		return param instanceof Element || param instanceof HTMLDocument;
	}
	/**
	 * Leniwiec class
	 *
	 * @class
	 */

	var Leniwiec =
		/*#__PURE__*/
		(function() {
			/**
			 * Class for lazy loading of images based on the IntersectionObserver API.
			 *
			 * @param {String} selector
			 * @param {Object} config
			 */
			function Leniwiec() {
				var selector =
					arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.leniwiec';
				var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

				_classCallCheck(this, Leniwiec);

				this.elements = document.querySelectorAll(selector);
				this.config = _extends({}, defaultConfig, config);
				this.observer = null;
			}

			_createClass(Leniwiec, [
				{
					key: 'mount',
					value: function mount() {
						this.observer = new IntersectionObserver(this.callback.bind(this), {
							root: this.config.root,
							rootMargin: this.config.rootMargin,
							threshold: this.config.threshold,
						});

						for (var i = 0; i < this.elements.length; i += 1) {
							this.observer.observe(this.elements[i]);
						} // Improving SEO - Load all images if the user is a robot

						if (isRobot()) {
							this.loadAll();
						}
					},
					/**
					 * Callback for the IntersectionObserver instance
					 *
					 * @param {Array} entries
					 */
				},
				{
					key: 'callback',
					value: function callback(entries) {
						var _this = this;

						entries.forEach(function(entry) {
							var target = entry.target;

							if (entry.isIntersecting) {
								_this.loadAndUnobserve(target);
							}
						});
					},
					/**
					 * The method that chooses how to add an image
					 *
					 * @param {Element} target
					 */
				},
				{
					key: 'load',
					value: function load(target) {
						switch (target.tagName) {
							case 'IMG':
								this.setSrc(target);
								break;

							case 'PICTURE':
								this.setPicture(target);
								break;

							default:
								this.setBackground(target);
						}
					},
					/**
					 * The method that adds a image for the <img> tag
					 *
					 * @param {Element} target
					 */
				},
				{
					key: 'setSrc',
					value: function setSrc(target) {
						this.bindImageEvents(target);
						var src = target.dataset.src || '';
						target.setAttribute('src', src);
					},
					/**
					 * The method that adds a background-image to any tag except the <img> and <picture> tags
					 *
					 * @param {Element} target
					 */
				},
				{
					key: 'setBackground',
					value: function setBackground(target) {
						var image = this.createImage(target);
						var src = target.dataset.backgroundImage || '';
						image.setAttribute('src', src); // eslint-disable-next-line no-param-reassign

						target.style.backgroundImage = 'url('.concat(src, ')');
					},
					/**
					 * The method that adds a image for the <picture> tag
					 *
					 * @param {Element} target
					 */
				},
				{
					key: 'setPicture',
					value: function setPicture(target) {
						var src = target.dataset.src || '';
						var alt = target.dataset.alt || '';
						var image = this.createImage(target);
						image.setAttribute('src', src);
						image.setAttribute('alt', alt);
						target.appendChild(image);
					},
					/**
					 * Creates Image object and bind events for it
					 *
					 * @param {Element} target
					 * @return {Image}
					 */
				},
				{
					key: 'createImage',
					value: function createImage(target) {
						var image = new Image();
						this.bindImageEvents(image, target);
						return image;
					},
					/**
					 * Method that binds the "loading" and "error" events to the images
					 *
					 * @param {Image|Element} image - instance of Image or image element
					 * @param {Element|undefined} target - <picture> or any element with "background-image" uses image param only for events callbacks
					 */
				},
				{
					key: 'bindImageEvents',
					value: function bindImageEvents(image, target) {
						var _this2 = this;

						var _this$config = this.config,
							loadedClassName = _this$config.loadedClassName,
							errorClassName = _this$config.errorClassName;
						var isTargetElement = isElement(target);

						var load = function load() {
							image.classList.add(loadedClassName);

							_this2.config.onLoad(image);

							if (isTargetElement) {
								target.classList.add(loadedClassName);
							}
						};

						var error = function error() {
							image.classList.add(errorClassName);

							_this2.config.onError(image);

							if (isTargetElement) {
								target.classList.add(errorClassName);
							}
						};

						image.addEventListener('load', load);
						image.addEventListener('error', error);
					},
					/**
					 * Load all elements immediately
					 */
				},
				{
					key: 'loadAllAndUnmount',
					value: function loadAllAndUnmount() {
						for (var i = 0; i < this.elements.length; i += 1) {
							this.loadAndUnobserve(this.elements[i]);
						}
					},
					/**
					 * Load an element and unobserve it from the IntersectionObserver instance
					 *
					 * @param {Element} target
					 */
				},
				{
					key: 'loadAndUnobserve',
					value: function loadAndUnobserve(target) {
						this.load(target);
						this.observer.unobserve(target);
					},
					/**
					 * Public method for adding items to observe
					 *
					 * @param {Element} element
					 */
				},
				{
					key: 'observe',
					value: function observe(element) {
						this.observer.observe(element);
					},
				},
			]);

			return Leniwiec;
		})();

	return Leniwiec;
});
