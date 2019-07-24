import typescript from 'rollup-plugin-typescript';
import banner from './banner';

export default {
	output: {
		name: 'Leniwiec',
		banner,
	},
	plugins: [
		typescript({
			target: 'es6',
		}),
	],
};
