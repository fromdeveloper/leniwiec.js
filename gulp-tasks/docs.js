const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const del = require('del');

function docsStyles() {
	return gulp
		.src('./docs/scss/styles.scss')
		.pipe(
			sass({
				outputStyle: 'compressed',
			}).on('error', sass.logError),
		)
		.pipe(rename('styles.min.css'))
		.pipe(gulp.dest('./docs/css'));
}

function copyLibToDocs() {
	return gulp.src('./dist/leniwiec.min.js').pipe(gulp.dest('./docs/js'));
}

function clean() {
	return del(['./docs/js', './docs/css']);
}

const build = gulp.series(clean, docsStyles, copyLibToDocs);

function watch() {
	gulp.watch('./docs/scss/*.scss', build);
}

module.exports = {
	watchDocs: watch,
	buildDocs: build,
};
