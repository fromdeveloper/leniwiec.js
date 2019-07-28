export interface DefaultConfig {
	root?: Element | null;
	rootMargin?: string;
	threshold?: number[] | number;

	errorClassName?: string;
	loadedClassName?: string;

	onLoad?(target: Element, ...args: any): void;
	onError?(target: Element, ...args: any): void;
}

/**  @const defaultConfig default class configuration */
const defaultConfig: DefaultConfig = {
	root: null,
	rootMargin: '0px',
	threshold: 0,

	errorClassName: 'is-error',
	loadedClassName: 'is-loaded',

	onLoad: null,
	onError: null,
};

export default defaultConfig;
