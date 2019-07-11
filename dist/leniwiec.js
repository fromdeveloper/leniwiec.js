/**
 * License: MIT
 * Generated on 2019/07/11 07:11
 * Author: Przemysław Tyczyński | https://tyczynski.pl
 * Copyright (c) 2019 Przemysław Tyczyński
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
	 * Check if the client is a robot
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
			 * @param {string} selector
			 * @param {object} config
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
						}

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
					 * The method that adds a image for the <img> or <iframe> tag
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
					 * The method that adds a background-image to any tag except the <img>, <picture> and <iframe> tags
					 *
					 * @param {Element} target
					 */
				},
				{
					key: 'setBackground',
					value: function setBackground(target) {
						var _this$config = this.config,
							loadedClassName = _this$config.loadedClassName,
							errorClassName = _this$config.errorClassName;
						var image = this.createImage({
							onLoad: function onLoad() {
								target.classList.add(loadedClassName);
							},
							onError: function onError() {
								target.classList.add(errorClassName);
							},
						});
						var src = target.dataset.background || '';
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
						var image = this.createImage();
						image.setAttribute('src', src);
						image.setAttribute('alt', alt);
						target.appendChild(image);
					},
					/**
					 * @param {object} callbacks
					 * @return {Image}
					 */
				},
				{
					key: 'createImage',
					value: function createImage() {
						var callbacks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
						var image = new Image();
						this.bindImageEvents(image, callbacks);
						return image;
					},
					/**
					 * Method that binds the "loading" and "error" events to the image being loaded
					 *
					 * @param {object} callbacks
					 * @param {Element} target
					 */
				},
				{
					key: 'bindImageEvents',
					value: function bindImageEvents(target) {
						var _this2 = this;

						var callbacks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
						var _this$config2 = this.config,
							loadedClassName = _this$config2.loadedClassName,
							errorClassName = _this$config2.errorClassName;

						var load = function load() {
							target.classList.add(loadedClassName);

							_this2.config.onLoad(target);

							if (typeof callbacks.onLoad === 'function') {
								callbacks.onLoad();
							}
						};

						var error = function error() {
							target.classList.add(errorClassName);

							_this2.config.onError(target);

							if (typeof callbacks.onError === 'function') {
								callbacks.onError();
							}
						};

						target.addEventListener('load', load);
						target.addEventListener('error', error);
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
