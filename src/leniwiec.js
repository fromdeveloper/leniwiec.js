import defaultConfig from './defaultConfig';

import isRobot from './utils/isRobot';
import isElement from './utils/isElement';

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
		this.bindImageEvents(target);

		const src = target.dataset.src || '';
		target.setAttribute('src', src);
	}

	/**
	 * The method that adds a background-image to any tag except the <img> and <picture> tags
	 *
	 * @param {Element} target
	 */
	setBackground(target) {
		const image = this.createImage(target);

		const src = target.dataset.backgroundImage || '';
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
		const src = target.dataset.src || '';
		const alt = target.dataset.alt || '';

		const image = this.createImage(target);
		image.setAttribute('src', src);
		image.setAttribute('alt', alt);

		target.appendChild(image);
	}

	/**
	 * Creates Image object and bind events for it
	 *
	 * @param {Element} target
	 * @return {Image}
	 */
	createImage(target) {
		const image = new Image();
		this.bindImageEvents(image, target);

		return image;
	}

	/**
	 * Method that binds the "loading" and "error" events to the images
	 *
	 * @param {Image|Element} image - instance of Image or image element
	 * @param {Element|undefined} target - <picture> or any element with "background-image" uses image param only for events callbacks
	 */
	bindImageEvents(image, target) {
		const { loadedClassName, errorClassName } = this.config;
		const isTargetElement = isElement(target);

		const load = () => {
			image.classList.add(loadedClassName);
			this.config.onLoad(image);

			if (isTargetElement) {
				target.classList.add(loadedClassName);
			}
		};

		const error = () => {
			image.classList.add(errorClassName);
			this.config.onError(image);

			if (isTargetElement) {
				target.classList.add(errorClassName);
			}
		};

		image.addEventListener('load', load);
		image.addEventListener('error', error);
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
}
