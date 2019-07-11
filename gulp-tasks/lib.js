const gulp = require('gulp');
const rollup = require('gulp-rollup');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const headerComment = require('gulp-header-comment');
const babel = require('gulp-babel');
const del = require('del');

const header = `
	License: <%= pkg.license %>
	Generated on <%= moment().format('YYYY/MM/DD HH:mm') %>
	Author: <%= pkg.author.name %> | <%= pkg.author.url %>
	Copyright (c) 2019 <%= pkg.author.name %>
`;

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
		.pipe(headerComment(header))
		.pipe(gulp.dest('./dist'))

		.pipe(uglify())
		.pipe(rename('leniwiec.min.js'))

		.pipe(headerComment(header))
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
