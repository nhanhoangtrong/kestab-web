const gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    watch = require('gulp-watch'),
    useref = require('gulp-useref'),
    stylus = require('gulp-stylus'),
    hb = require('gulp-hb'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    htmlReplace = require('gulp-html-replace');

const del = require('del');
const browserSync = require('browser-sync').create();

function logPluginError(pluginName) {
    return function(error) {
        // When plugin error occured
        // logging error stack via gutil
        gutil.log(pluginName, error.stack);
        // and send notify to browser
        browserSync.notify(error.stack, 10000);
        this.emit('end');
    };
}

const src = {
    styl: './src/styl/**/*.styl',
    sass: './src/sass/**/*.scss',
    css: './src/css/**/*.css',
    img: './src/img/**/*',
    html: './src/**/*.html',
    hbs: './src/templates/**/*.hbs',
    js: './src/js/**/*.js',
    templatesDir: './src/templates/**/*',
    templates: './src/templates/pages/{,posts/}*.hbs',
    layouts: './src/templates/layouts/*.hbs',
    partials: './src/templates/partials/*.hbs',
    data: './src/templates/data/*.{json,js}',
    helpers: './src/templates/helpers/*.js',
};

const dest = {
    styl: './src/css/styl',
    sass: './src/css/sass',
    html: './src',
};

const dist = {
    css: './dist/css',
    js: './dist/js',
    html: './dist/',
    img: './dist/img',
};

function stylusTask() {
    return gulp
        .src(src.styl)
        .pipe(sourcemaps.init())
        .pipe(stylus().on('error', logPluginError('stylus')))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest.styl))
        .pipe(
            browserSync.stream({
                once: true,
            })
        );
}

function sassTask() {
    return gulp
        .src(src.sass)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', logPluginError('sass')))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest.sass))
        .pipe(
            browserSync.stream({
                once: false, // inject many .css
            })
        );
}

function handlebarsTask() {
    var hbsStream = hb()
        .partials(src.layouts)
        .partials(src.partials)
        .helpers(require('handlebars-layouts'))
        .helpers(src.helpers)
        .data(src.data)
        .on('error', logPluginError('handlebars'));

    return gulp
        .src(src.templates)
        .pipe(hbsStream)
        .pipe(
            rename(function(path) {
                path.extname = '.html';
            })
        )
        .pipe(gulp.dest(dest.html))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
}

function browserSyncTask() {
    const baseDir = process.env.NODE_ENV === 'production' ? './dist' : './src';
    browserSync.init({
        server: {
            baseDir: baseDir,
        },
        serveStatic: [
            {
                route: '/node_modules',
                dir: 'node_modules',
            },
        ],
    });
}

function htmlminTask() {
    const replaceTasks = Object.assign({}, require('./cdnmap.json'));
    return gulp
        .src(src.html)
        .pipe(htmlReplace(replaceTasks))
        .pipe(useref())
        .pipe(
            htmlmin({
                collapseWhitespace: true,
            }).on('error', logPluginError('htmlmin'))
        )
        .pipe(gulp.dest(dist.html));
}

function uglifyTask() {
    return gulp
        .src(src.js)
        .pipe(uglify().on('error', logPluginError('uglify')))
        .pipe(gulp.dest(dist.js));
}

function cssnanoTask() {
    return gulp
        .src(src.css)
        .pipe(cssnano().on('error', logPluginError('cssnano')))
        .pipe(gulp.dest(dist.css));
}

function imageminTask() {
    return gulp
        .src(src.img)
        .pipe(imagemin().on('error', logPluginError('imagemin')))
        .pipe(gulp.dest(dist.img));
}

function cleanTask() {
    return del('./dist');
}

const watchDevTask = (exports.watch = function watchDevTask() {
    gulp.watch(src.styl, stylusTask);
    gulp.watch(src.sass, sassTask);
    gulp.watch(src.templatesDir, handlebarsTask);
    gulp.watch(src.js, browserSync.reload);
    gulp.watch(src.img, browserSync.reload);
});

const build = (exports.build = gulp.series(
    cleanTask,
    gulp.parallel(stylusTask, handlebarsTask, sassTask),
    gulp.parallel(cssnanoTask, uglifyTask, imageminTask),
    htmlminTask
));

const serve = (exports.serve = gulp.series(build, browserSyncTask));

exports.start =
    process.env.NODE_ENV === 'production'
        ? serve
        : gulp.parallel(watchDevTask, browserSyncTask);
