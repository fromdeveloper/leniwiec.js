import resolve from 'rollup-plugin-node-resolve';
import build from './build';

export default Object.assign(build, {
	input: 'src/index.ts',
	output: Object.assign(build.output, {
		file: 'lib/leniwiec.js',
		format: 'umd',
	}),
	plugins: build.plugins.concat([
		resolve({
			deps: true,
		}),
	])
});
