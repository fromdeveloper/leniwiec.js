import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';

import banner from './banner';

export default {
	output: {
		name: 'Leniwiec',
		banner,
		globals: {
			calliffn: 'callIfFn',
		}
	},
	plugins: [
		commonjs(),
		typescript({
			target: 'es6',
		}),
	],
};
