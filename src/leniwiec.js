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
	 * @param {string} selector
	 * @param {object} config
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
	 * The method that adds a image for the <img> or <iframe> tag
	 *
	 * @param {Element} target
	 */
	setSrc(target) {
		this.bindImageEvents(target);

		const src = target.dataset.src || '';
		target.setAttribute('src', src);
	}

	/**
	 * The method that adds a background-image to any tag except the <img>, <picture> and <iframe> tags
	 *
	 * @param {Element} target
	 */
	setBackground(target) {
		const { loadedClassName, errorClassName } = this.config;

		const image = this.createImage({
			onLoad() {
				target.classList.add(loadedClassName);
			},
			onError() {
				target.classList.add(errorClassName);
			},
		});

		const src = target.dataset.background || '';
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

		const image = this.createImage();
		image.setAttribute('src', src);
		image.setAttribute('alt', alt);

		target.appendChild(image);
	}

	/**
	 * @param {object} callbacks
	 * @return {Image}
	 */
	createImage(callbacks = {}) {
		const image = new Image();
		this.bindImageEvents(image, callbacks);

		return image;
	}

	/**
	 * Method that binds the "loading" and "error" events to the image being loaded
	 *
	 * @param {object} callbacks
	 * @param {Element} target
	 */
	bindImageEvents(target, callbacks = {}) {
		const { loadedClassName, errorClassName } = this.config;

		const load = () => {
			target.classList.add(loadedClassName);
			this.config.onLoad(target);

			if (typeof callbacks.onLoad === 'function') {
				callbacks.onLoad();
			}
		};

		const error = () => {
			target.classList.add(errorClassName);
			this.config.onError(target);

			if (typeof callbacks.onError === 'function') {
				callbacks.onError();
			}
		};

		target.addEventListener('load', load);
		target.addEventListener('error', error);
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
