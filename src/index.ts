import callIfFn from 'calliffn';
import defaultConfig, { DefaultConfig } from './defaultConfig';
import isRobot from './utils/isRobot';

interface TargetAttributes {
	src: string;
	alt: string;
}

/**
 * Leniwiec class
 *
 * @class
 */
export default class Leniwiec {
	private elements: HTMLElement[];
	private config: DefaultConfig;
	private observer: IntersectionObserver;

	/**
	 * Class for lazy loading of images based on the IntersectionObserver API.
	 *
	 * @param elements
	 * @param config
	 */
	public constructor(elements: any, config: DefaultConfig = {}) {
		this.elements = Leniwiec.getElements(elements) as HTMLElement[];

		this.config = {
			...defaultConfig,
			...config,
		};

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
	private createObserver(): IntersectionObserver {
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
	private callback(entries: IntersectionObserverEntry[]): void {
		entries.forEach((entry: IntersectionObserverEntry): void => {
			const { target } = entry;

			if (entry.isIntersecting) {
				this.loadAndUnobserve(target as HTMLElement);
			}
		});
	}

	/**
	 * Load an element and unobserve it from the IntersectionObserver instance
	 *
	 * @param {HTMLElement} target - IntersectionObserverEntry target
	 * @return {void}
	 */
	private loadAndUnobserve(target: HTMLElement): void {
		this.load(target);
		this.observer.unobserve(target);
	}

	/**
	 * The method that chooses how to add an image
	 *
	 * @param {HTMLElement} target - IntersectionObserverEntry target
	 * @return {void}
	 */
	private load(target: HTMLElement): void {
		const attributes = this.getTargetAttributes(target);

		if (target.hasAttribute('data-load-image')) {
			this.loadImg(target, attributes, [attributes.src]);
		} else {
			if (target.tagName === 'IMG') {
				this.setImg(target, attributes);
			} else if (target.tagName === 'PICTURE') {
				this.setPicture(target, attributes);
			} else {
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
	private loadImg(target: HTMLElement, attributes: TargetAttributes, payload: any[]): void {
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
	private setImg(target: HTMLElement, attributes: TargetAttributes): void {
		const { src } = attributes;

		this.bindTargetCallbacks(target as HTMLImageElement, target);

		target.setAttribute('src', src);
	}

	/**
	 * The method that adds a background-image to any tag except the <img> and <picture> tags
	 *
	 * @param {HTMLElement} target - IntersectionObserverEntry target
	 * @param {TargetAttributes} attributes - target attributes
	 * @return {void}
	 */
	private setBackgroundImage(target: HTMLElement, attributes: TargetAttributes): void {
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
	private setPicture(target: HTMLElement, attributes: TargetAttributes): void {
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
	private getTargetAttributes(target: HTMLElement): TargetAttributes {
		const src =
			target.dataset.src || target.dataset.backgroundImage || target.dataset.loadImage || '';
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
	private bindTargetCallbacks(
		eventElement: HTMLImageElement,
		target: HTMLElement,
		payload: any[] = [],
	): void {
		const { loadedClassName, errorClassName } = this.config;

		const load = (): void => {
			target.classList.add(loadedClassName);
			callIfFn(this.config.onLoad, target, ...payload);
		};

		const error = (): void => {
			target.classList.add(errorClassName);
			callIfFn(this.config.onError, target, ...payload);
		};

		eventElement.addEventListener('load', load);
		eventElement.addEventListener('error', error);
	}

	/**
	 * Load all elements immediately
	 *
	 * @return {void}
	 */
	public loadAll(): void {
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
	public observe(element: HTMLElement): void {
		this.observer.observe(element);
	}

	/**
	 * Immediately unobserve all elements
	 *
	 * @return {void}
	 */
	public unmount(): void {
		this.observer.disconnect();
	}

	/**
	 * Convert the passed argument to the Node[] or throw Error
	 *
	 * @param {*} elements
	 * @return {Node[]}
	 */
	private static getElements(elements: any): Node[] {
		if (typeof elements === 'string') {
			return Array.from(document.querySelectorAll(elements));
		} else if (elements instanceof NodeList) {
			return Array.from(elements);
		} else if (elements instanceof HTMLElement) {
			return [elements];
		} else if (elements instanceof Array) {
			return elements;
		} else {
			throw new Error(
				'Passed elements should be a string selector, NodeList, HTMLElement, Node, HTMLElement[] or Node[]',
			);
		}
	}
}
