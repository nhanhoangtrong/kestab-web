const 	gulp = require('gulp'),
		htmlmin = require('gulp-htmlmin'),
		gutil = require('gulp-util'),
		uglify = require('gulp-uglify'),
		cssnano = require('gulp-cssnano'),
		imagemin = require('gulp-imagemin'),
		watch = require('gulp-watch'),
		useref = require('gulp-useref'),
		stylus = require('gulp-stylus'),
		hb = require('gulp-hb'),
		rename = require('gulp-rename')

const runSequence = require('run-sequence')
const del = require('del')
const browserSync = require('browser-sync').create()

const src = {
	styl: './src/styl/**/*.styl',
	css: './src/css/**/*.css',
	img: './src/img/**/*',
	hbs: './src/templates/**/*.hbs',
	js: './src/js/**/*.js',
	layouts: './src/templates/*.hbs',
	partials: './src/templates/partials/*.hbs',
	data: './src/templates/data/*.{json,js}',
	helpers: './src/templates/helpers/*.js'
}

const dest = {
	styl: './src/css',
	html: './src'
}

const dist = {
	css: './dist/css',
	js: './dist/js',
	html: './dist/',
	img: './dist/img'
}

gulp.task('stylus', function() {
	return gulp.src(src.styl)
		.pipe(stylus().on('error', function(err) {
			gutil.log('[stylus-error]', err.message)
			this.emit('end')
		})).pipe(gulp.dest(dest.styl))
		.pipe(browserSync.stream({
			once: true
		}))
})

gulp.task('handlebars', function() {
	return gulp.src(src.layouts)
		.pipe(hb({
			partials: src.partials,
			data: src.data,
			helpers: src.helpers
		}).on('error', function(err) {
			gutil.log('[handlebars-error]', err.message)
			this.emit('end')
		}))
		.pipe(rename(function(path) {
			path.extname = '.html'
		}))
		.pipe(gulp.dest(dest.html))
		.pipe(browserSync.reload({
			stream: true
		}))
})

gulp.task('browserSync', function() {
	const baseDir = process.env.NODE_ENV === 'production' ? './dist' : './src'
	browserSync.init({
		server: {
			baseDir: baseDir
		}
	})
})

gulp.task('htmlmin', function() {
	return gulp.src(src.html)
		.pipe(htmlmin({
			collapseWhitespace: true
		}).on('error', function(err) {
			gutil.log('[htmlmin-error]', err.message)
			this.emit('end')
		}))
		.pipe(gulp.dest(dist.html))
})

gulp.task('uglify', function() {
	return gulp.src(src.js)
		.pipe(uglify().on('error', function(err) {
			gutil.log('[uglify-error]', err.message)
			this.emit('end')
		}))
		.pipe(gulp.dest(dist.js))
})

gulp.task('cssnano', function() {
	return gulp.src(src.css)
		.pipe(cssnano().on('error', function(err) {
			gutil.log('[cssnano-error]', err.message)
			this.emit('end')
		}))
		.pipe(gulp.dest(dist.css))
})

gulp.task('imagemin', function() {
	return gulp.src(src.img)
		.pipe(imagemin().on('error', function(err) {
			gutil.log('[imagemin-error', err.message)
			this.emit('end')
		}))
		.pipe(gulp.dest(dist.img))
})

gulp.task('watch', ['stylus', 'browserSync', 'handlebars'], function() {
	watch(src.styl, function(vinyl) {
		gulp.start('stylus')
	})
	watch(src.hbs, function(vinyl) {
		gulp.start('handlebars')
	})
	watch(src.js, browserSync.reload)
	watch(src.img, browserSync.reload)
})

gulp.task('serve', function(cb) {
	runSequence('build', 'browserSync', cb)
})

gulp.task('clean', function(cb) {
	del('./dist').then(function() {
		cb()
	})
})

gulp.task('build', function(cb) {
	runSequence('clean', ['stylus', 'handlebars'], ['cssnano', 'uglify', 'htmlmin', 'imagemin'], cb)
})

gulp.task('start', function(cb) {
	if (process.env.NODE_ENV === 'production') {
		gulp.start('serve')
	} else {
		gulp.start('watch')
	}
})
