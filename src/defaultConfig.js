/**  @const {Object} defaultConfig default class configuration */
const defaultConfig = {
	root: null,
	rootMargin: '0px',
	threshold: 0,

	errorClassName: 'is-error',
	loadedClassName: 'is-loaded',

	onLoad: () => {},
	onError: () => {},
};

export default defaultConfig;
