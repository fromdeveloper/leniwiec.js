import Leniwiec from '../src';
import defaultConfig from '../src/defaultConfig';

describe('leniwiec.js', () => {
	test('should be a class', () => {
		expect(Leniwiec).toBeInstanceOf(Function);
	});

	describe('static function getElements', () => {
		const observeMock = {
			observe: () => null,
			disconnect: () => null
		};

		beforeEach((() => {
			(<any> window).IntersectionObserver = () => observeMock;
		}));

		test('passed [] should be transform to HTMLElement[]', () => {
			const test = new Leniwiec([]);
			expect(Array.isArray(test.elements)).toBe(true);
		});

		test('passed string selector should be transform to HTMLElement[]', () => {
			const selectorItems = new Leniwiec('.leniwiec');
			expect(Array.isArray(selectorItems.elements)).toBe(true);
		});

		test('passed HTMLElement should be transform to HTMLElement[]', () => {
			document.body.innerHTML = `
				<p class="leniwiec"></p>
			`;

			const selectorItems = new Leniwiec(document.querySelector('.leniwiec'));
			expect(Array.isArray(selectorItems.elements)).toBe(true);
		});

		test('passed NodeList should be transform to HTMLElement[]', () => {
			const selectorItems = new Leniwiec(document.querySelectorAll('.leniwiec'));
			expect(Array.isArray(selectorItems.elements)).toBe(true);
		});
	});

	describe('class constructor', () => {
		const observeMock = {
			observe: () => null,
			disconnect: () => null
		};

		beforeEach((() => {
			(<any> window).IntersectionObserver = () => observeMock;
		}));

		test('this.elements length shound be equal 2', () => {
			document.body.innerHTML = `
				<p class="leniwiec"></p>
				<p class="leniwiec"></p>
			`;

			const leniwiec = new Leniwiec(document.querySelectorAll('.leniwiec'));
			expect(leniwiec.elements.length).toBe(2);
		});

		test('this.elements length shound be equal 1', () => {
			document.body.innerHTML = `
				<p class="changed-leniwiec"></p>
				<p class="leniwiec"></p>
			`;

			const leniwiec = new Leniwiec('.changed-leniwiec');
			expect(leniwiec.elements.length).toBe(1);
		});

		test('this.elements length shound be equal 0', () => {
			document.body.innerHTML = '';

			const leniwiec = new Leniwiec([]);
			expect(leniwiec.elements.length).toBe(0);
		});

		test('this.config shound be equal with defaultConfig', () => {
			const leniwiec = new Leniwiec([]);

			expect(leniwiec.config).toEqual(defaultConfig);
		});

		test('this.config shound be equal with config', () => {
			const config = {
				...defaultConfig,
				errorClassName: 'error',
			};

			const leniwiec = new Leniwiec('.leniwiec', config);

			expect(leniwiec.config).toEqual(config);
		});
	});
});
