/*!
 * @package Leniwiec.js
 * @version v2.0.0
 * @author Przemysław Tyczyński | https://tyczynski.pl
 * @license MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.Leniwiec = factory());
}(this, function () { 'use strict';

	var lib=(a,...b)=>{if("function"==typeof a)return a(...b)};

	/**  @const defaultConfig default class configuration */
	const defaultConfig = {
	    root: null,
	    rootMargin: '0px',
	    threshold: 0,
	    errorClassName: 'is-error',
	    loadedClassName: 'is-loaded',
	    onLoad: null,
	    onError: null,
	};

	/**
	 * Check if the user is a robot
	 *
	 * @return {boolean}
	 */
	function isRobot() {
	    const isBrowser = typeof window !== 'undefined';
	    return ((isBrowser && !('onscroll' in window)) ||
	        (typeof navigator !== 'undefined' && /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent)));
	}

	/**
	 * Leniwiec class
	 *
	 * @class
	 */
	class Leniwiec {
	    /**
	     * Class for lazy loading of images based on the IntersectionObserver API.
	     *
	     * @param elements
	     * @param config
	     */
	    constructor(elements, config = {}) {
	        this.elements = Leniwiec.getElements(elements);
	        this.config = Object.assign({}, defaultConfig, config);
	        this.observer = this.createObserver();
	        // Improving SEO - Load all images if the user is a robot
	        if (isRobot()) {
	            this.loadAll();
	        }
	    }
	    /**
	     * Create IntersectionObserver instance
	     *
	     * @return {IntersectionObserver}
	     */
	    createObserver() {
	        const { root, rootMargin, threshold } = this.config;
	        const observer = new IntersectionObserver(this.callback.bind(this), {
	            root,
	            rootMargin,
	            threshold,
	        });
	        for (let element of this.elements) {
	            observer.observe(element);
	        }
	        return observer;
	    }
	    /**
	     * Callback for the IntersectionObserver instance
	     *
	     * @param {IntersectionObserverEntry[]} entries
	     * @return {void}
	     */
	    callback(entries) {
	        entries.forEach((entry) => {
	            const { target } = entry;
	            if (entry.isIntersecting) {
	                this.loadAndUnobserve(target);
	            }
	        });
	    }
	    /**
	     * Load an element and unobserve it from the IntersectionObserver instance
	     *
	     * @param {HTMLElement} target - IntersectionObserverEntry target
	     * @return {void}
	     */
	    loadAndUnobserve(target) {
	        this.load(target);
	        this.observer.unobserve(target);
	    }
	    /**
	     * The method that chooses how to add an image
	     *
	     * @param {HTMLElement} target - IntersectionObserverEntry target
	     * @return {void}
	     */
	    load(target) {
	        const attributes = this.getTargetAttributes(target);
	        if (target.hasAttribute('data-load-image')) {
	            this.loadImg(target, attributes, [attributes.src]);
	        }
	        else {
	            if (target.tagName === 'IMG') {
	                this.setImg(target, attributes);
	            }
	            else if (target.tagName === 'PICTURE') {
	                this.setPicture(target, attributes);
	            }
	            else {
	                this.setBackgroundImage(target, attributes);
	            }
	        }
	    }
	    /**
	     * The method that only load a image
	     *
	     * @param {HTMLElement} target - IntersectionObserverEntry target
	     * @param {TargetAttributes} attributes - target attributes
	     * @param {any[]} payload - additional payload for target callback
	     * @return {void}
	     */
	    loadImg(target, attributes, payload) {
	        const { src } = attributes;
	        const image = new Image();
	        this.bindTargetCallbacks(image, target, payload);
	        image.setAttribute('src', src);
	    }
	    /**
	     * The method that adds a image for the <img> tag
	     *
	     * @param {HTMLElement} target - IntersectionObserverEntry target
	     * @param {TargetAttributes} attributes - target attributes
	     * @return {void}
	     */
	    setImg(target, attributes) {
	        const { src } = attributes;
	        this.bindTargetCallbacks(target, target);
	        target.setAttribute('src', src);
	    }
	    /**
	     * The method that adds a background-image to any tag except the <img> and <picture> tags
	     *
	     * @param {HTMLElement} target - IntersectionObserverEntry target
	     * @param {TargetAttributes} attributes - target attributes
	     * @return {void}
	     */
	    setBackgroundImage(target, attributes) {
	        const { src } = attributes;
	        const image = new Image();
	        this.bindTargetCallbacks(image, target);
	        image.setAttribute('src', src);
	        // eslint-disable-next-line no-param-reassign
	        target.style.backgroundImage = `url(${src})`;
	    }
	    /**
	     * The method that adds a image for the <picture> tag
	     *
	     * @param {HTMLElement} target - IntersectionObserverEntry target
	     * @param {TargetAttributes} attributes - target attributes
	     * @return {void}
	     */
	    setPicture(target, attributes) {
	        const { src, alt } = attributes;
	        const image = new Image();
	        this.bindTargetCallbacks(image, target);
	        image.setAttribute('src', src);
	        image.setAttribute('alt', alt);
	        target.appendChild(image);
	    }
	    /**
	     * Gets attribute of the target element
	     *
	     * @param {HTMLElement} target - IntersectionObserverEntry target
	     * @return {TargetAttributes}
	     */
	    getTargetAttributes(target) {
	        const src = target.dataset.src || target.dataset.backgroundImage || target.dataset.loadImage || '';
	        const { alt = '' } = target.dataset;
	        return { src, alt };
	    }
	    /**
	     * Binds the "loading" and "error" events to the image
	     *
	     * @param {HTMLImageElement} eventElement
	     * @param {HTMLElement} target
	     * @param {any[]} payload
	     * @return {void}
	     */
	    bindTargetCallbacks(eventElement, target, payload = []) {
	        const { loadedClassName, errorClassName } = this.config;
	        const load = () => {
	            target.classList.add(loadedClassName);
	            lib(this.config.onLoad, target, ...payload);
	        };
	        const error = () => {
	            target.classList.add(errorClassName);
	            lib(this.config.onError, target, ...payload);
	        };
	        eventElement.addEventListener('load', load);
	        eventElement.addEventListener('error', error);
	    }
	    /**
	     * Load all elements immediately
	     *
	     * @return {void}
	     */
	    loadAll() {
	        for (let element of this.elements) {
	            this.loadAndUnobserve(element);
	        }
	    }
	    /**
	     * Add item to observe
	     *
	     * @param {HTMLElement} element - IntersectionObserverEntry target
	     * @return {void}
	     */
	    observe(element) {
	        this.observer.observe(element);
	    }
	    /**
	     * Immediately unobserve all elements
	     *
	     * @return {void}
	     */
	    unmount() {
	        this.observer.disconnect();
	    }
	    /**
	     * Convert the passed argument to the Node[] or throw Error
	     *
	     * @param {*} elements
	     * @return {Node[]}
	     */
	    static getElements(elements) {
	        if (typeof elements === 'string') {
	            return Array.from(document.querySelectorAll(elements));
	        }
	        else if (elements instanceof NodeList) {
	            return Array.from(elements);
	        }
	        else if (elements instanceof HTMLElement) {
	            return [elements];
	        }
	        else if (elements instanceof Array) {
	            return elements;
	        }
	        else {
	            throw new Error('Passed elements should be a string selector, NodeList, HTMLElement, Node, HTMLElement[] or Node[]');
	        }
	    }
	}

	return Leniwiec;

}));
