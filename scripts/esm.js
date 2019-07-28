import build from './build';

export default Object.assign(build, {
	input: 'src/index.ts',
	output: Object.assign(build.output, {
		file: 'lib/leniwiec.es.js',
		format: 'esm',
	}),
});
