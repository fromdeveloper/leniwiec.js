import Leniwiec from '../src/leniwiec';
import defaultConfig from '../src/defaultConfig';

describe('leniwiec.js', () => {
	test('should be a class', () => {
		expect(Leniwiec).toBeInstanceOf(Function);
	});

	describe('class constructor', () => {
		test('this.observer shound be a null', () => {
			const leniwiec = new Leniwiec();

			expect(leniwiec.observer).toBeNull();
		});

		test('this.elements length shound be equal 2', () => {
			document.body.innerHTML = `
				<p class="leniwiec"></p>
				<p class="leniwiec"></p>
			`;

			const leniwiec = new Leniwiec();
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

			const leniwiec = new Leniwiec();
			expect(leniwiec.elements.length).toBe(0);
		});

		test('this.config shound be equal with defaultConfig', () => {
			const leniwiec = new Leniwiec();

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
