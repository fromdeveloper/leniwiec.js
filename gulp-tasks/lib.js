const gulp = require('gulp');
const rollup = require('gulp-rollup');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const header = require('gulp-header');
const babel = require('gulp-babel');
const del = require('del');

const pkg = require('../package.json');
const banner = [
	'/**',
	' * @package <%= pkg.name %> - <%= pkg.description %>',
	' * @version v<%= pkg.version %>',
	' * @link <%= pkg.homepage %>',
	' * @author <%= pkg.author.name %> | <%= pkg.author.url %>',
	' * @license <%= pkg.license %>',
	' */',
	'',
].join('\n');

function umd() {
	process.env.NODE_ENV = 'release';

	return gulp
		.src('./src/**/*.js')
		.pipe(
			rollup({
				output: { name: 'Leniwiec', format: 'umd' },
				input: './src/leniwiec.js',
			}),
		)
		.pipe(babel())
		.pipe(rename('leniwiec.js'))
		.pipe(header(banner, { pkg }))
		.pipe(gulp.dest('./dist'))

		.pipe(uglify())
		.pipe(rename('leniwiec.min.js'))

		.pipe(header(banner, { pkg }))
		.pipe(gulp.dest('./dist'));
}

function clean() {
	return del(['./dist']);
}

const build = gulp.series(clean, umd);

function watch() {
	gulp.watch(['./src/**/*.js'], build);
}

module.exports = {
	buildLib: build,
	watchLib: watch,
};
