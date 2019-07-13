import defaultConfig from './defaultConfig';

import isRobot from './utils/isRobot';

/**
 * Leniwiec class
 *
 * @class
 */
export default class Leniwiec {
	/**
	 * Class for lazy loading of images based on the IntersectionObserver API.
	 *
	 * @param {String} selector
	 * @param {Object} config
	 */
	constructor(selector = '.leniwiec', config = {}) {
		this.elements = document.querySelectorAll(selector);
		this.config = Object.assign({}, defaultConfig, config);

		this.observer = null;
	}

	mount() {
		this.observer = new IntersectionObserver(this.callback.bind(this), {
			root: this.config.root,
			rootMargin: this.config.rootMargin,
			threshold: this.config.threshold,
		});

		for (let i = 0; i < this.elements.length; i += 1) {
			this.observer.observe(this.elements[i]);
		}

		// Improving SEO - Load all images if the user is a robot
		if (isRobot()) {
			this.loadAll();
		}
	}

	/**
	 * Callback for the IntersectionObserver instance
	 *
	 * @param {Array} entries
	 */
	callback(entries) {
		entries.forEach(entry => {
			const { target } = entry;

			if (entry.isIntersecting) {
				this.loadAndUnobserve(target);
			}
		});
	}

	/**
	 * The method that chooses how to add an image
	 *
	 * @param {Element} target
	 */
	load(target) {
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
	}

	/**
	 * The method that adds a image for the <img> tag
	 *
	 * @param {Element} target
	 */
	setSrc(target) {
		const { src } = Leniwiec.getTargetAttributes(target);

		this.bindImageEvents(target, target);

		target.setAttribute('src', src);
	}

	/**
	 * The method that adds a background-image to any tag except the <img> and <picture> tags
	 *
	 * @param {Element} target
	 */
	setBackground(target) {
		const { src } = Leniwiec.getTargetAttributes(target);

		const image = new Image();
		this.bindImageEvents(image, target);
		image.setAttribute('src', src);

		// eslint-disable-next-line no-param-reassign
		target.style.backgroundImage = `url(${src})`;
	}

	/**
	 * The method that adds a image for the <picture> tag
	 *
	 * @param {Element} target
	 */
	setPicture(target) {
		const { src, alt } = Leniwiec.getTargetAttributes(target);

		const image = new Image();
		this.bindImageEvents(image, target);

		image.setAttribute('src', src);
		image.setAttribute('alt', alt);

		target.appendChild(image);
	}

	/**
	 * Method that binds the "loading" and "error" events to the images
	 *
	 * @param {Image|Element} eventElement
	 * @param {Element} target
	 */
	bindImageEvents(eventElement, target) {
		const { loadedClassName, errorClassName } = this.config;

		const load = () => {
			target.classList.add(loadedClassName);
			this.config.onLoad(target);
		};

		const error = () => {
			target.classList.add(errorClassName);
			this.config.onError(target);
		};

		eventElement.addEventListener('load', load);
		eventElement.addEventListener('error', error);
	}

	/**
	 * Load all elements immediately
	 */
	loadAllAndUnmount() {
		for (let i = 0; i < this.elements.length; i += 1) {
			this.loadAndUnobserve(this.elements[i]);
		}
	}

	/**
	 * Load an element and unobserve it from the IntersectionObserver instance
	 *
	 * @param {Element} target
	 */
	loadAndUnobserve(target) {
		this.load(target);
		this.observer.unobserve(target);
	}

	/**
	 * Public method for adding items to observe
	 *
	 * @param {Element} element
	 */
	observe(element) {
		this.observer.observe(element);
	}

	/**
	 * Gets and returns the "alt" and "src" of the target element
	 *
	 * @param {Element} target
	 * @return {Object}
	 */
	static getTargetAttributes(target) {
		const src = target.dataset.src || target.dataset.backgroundImage || '';
		const alt = target.dataset.alt || '';

		return { src, alt };
	}
}
