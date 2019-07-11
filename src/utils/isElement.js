/**
 * Checks whether the passed parameter is an Element or HTMLElement
 *
 * @param {*} param
 * @return {bool}
 */
export default function isElement(param) {
	return param instanceof Element || param instanceof HTMLDocument;
}
