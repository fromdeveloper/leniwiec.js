import isElement from '../src/utils/isElement';

describe('isElement.js', () => {
	test('should be a function', () => {
		expect(isElement).toBeInstanceOf(Function);
	});

	test('should returns false if passed function', () => {
		expect(isElement(() => {})).toBeFalsy();
	});

	test('should returns false if passed object', () => {
		expect(isElement({})).toBeFalsy();
	});

	test('should returns false if passed array', () => {
		expect(isElement([])).toBeFalsy();
	});

	test('should returns false if passed string', () => {
		expect(isElement('leniwiec')).toBeFalsy();
	});

	test('should returns false if passed number', () => {
		expect(isElement(61)).toBeFalsy();
	});

	test('should returns false if passed null', () => {
		expect(isElement(null)).toBeFalsy();
	});

	test('should returns false if passed undefined', () => {
		expect(isElement(undefined)).toBeFalsy();
	});

	test('should returns false if passed symbol', () => {
		expect(isElement(Symbol('leniwiec'))).toBeFalsy();
	});

	test('should returns true if passed element', () => {
		const div = document.createElement('div');
		expect(isElement(div)).toBeTruthy();
	});
});
