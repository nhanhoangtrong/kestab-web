const gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    postCss = require('gulp-postcss'),
    imagemin = require('gulp-imagemin'),
    useref = require('gulp-useref'),
    hb = require('gulp-hb'),
    rename = require('gulp-rename'),
    htmlReplace = require('gulp-html-replace');

const del = require('del');
const browserSync = require('browser-sync').create();

function logPluginError(pluginName) {
    return function (error) {
        // When plugin error occured
        // logging error stack via gutil
        gutil.log(pluginName, error.stack);
        // and send notify to browser
        browserSync.notify(error.stack, 10000);
        this.emit('end');
    };
}

function createCopyTask(src, dest) {
    const func = () => {
        return gulp
            .src(src)
            .pipe(gulp.dest(dest))
            .pipe(browserSync.reload({ stream: true }));
    };

    func.name = `Copy${src}To${dest}`;
    return func;
}

const srcDir = {
    css: './src/css/**/*.css',
    img: './src/img/**/*',
    html: './src/**/*.html',
    hbs: './src/templates/**/*.hbs',
    js: './src/js/**/*.js',
    templatesDir: './src/templates/**/*',
    pages: './src/templates/pages/**/*.hbs',
    layouts: './src/templates/layouts/*.hbs',
    partials: './src/templates/partials/*.hbs',
    data: './src/templates/data/*.{json,js}',
    helpers: './src/templates/helpers/*.js',
};

const distDir = {
    css: './dist/css',
    js: './dist/js',
    html: './dist/',
    img: './dist/img',
};

function postCssTask() {
    return gulp
        .src(srcDir.css)
        .pipe(
            postCss(
                [require('tailwindcss'), require('autoprefixer')].concat(
                    process.env.NODE_ENV === 'production'
                        ? [require('cssnano')]
                        : []
                )
            ).on('error', logPluginError('postCss'))
        )
        .pipe(gulp.dest(distDir.css))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
}

function handlebarsTask() {
    var hbsStream = hb()
        .partials(srcDir.layouts)
        .partials(srcDir.partials)
        .helpers(require('handlebars-layouts'))
        .helpers(srcDir.helpers)
        .data(srcDir.data)
        .on('error', logPluginError('handlebars'));

    return gulp
        .src(srcDir.pages, {
            base: './src/templates/pages',
        })
        .pipe(hbsStream)
        .pipe(
            rename(function (path) {
                path.extname = '.html';
            })
        )
        .pipe(gulp.dest(distDir.html))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
}

function browserSyncTask() {
    browserSync.init({
        server: {
            baseDir: './dist',
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
        .src(srcDir.html)
        .pipe(htmlReplace(replaceTasks))
        .pipe(useref())
        .pipe(
            htmlmin({
                collapseWhitespace: true,
            }).on('error', logPluginError('htmlmin'))
        )
        .pipe(gulp.dest(distDir.html));
}

function uglifyTask() {
    return gulp
        .src(srcDir.js)
        .pipe(uglify().on('error', logPluginError('uglify')))
        .pipe(gulp.dest(distDir.js));
}

function imageminTask() {
    return gulp
        .src(srcDir.img)
        .pipe(imagemin().on('error', logPluginError('imagemin')))
        .pipe(gulp.dest(distDir.img));
}

function cleanTask() {
    return del('./dist');
}

const watchDevTask = (exports.watch = function watchDevTask() {
    gulp.watch(srcDir.css, postCssTask);
    gulp.watch(
        [
            srcDir.pages,
            srcDir.data,
            srcDir.layouts,
            srcDir.partials,
            srcDir.helpers,
        ],
        handlebarsTask
    );
    gulp.watch(srcDir.js, createCopyTask(srcDir.js, distDir.js));
    gulp.watch(srcDir.img, createCopyTask(srcDir.img, distDir.img));
});

const build = (exports.build = gulp.series(
    cleanTask,
    gulp.parallel(handlebarsTask, postCssTask),
    gulp.parallel(uglifyTask, imageminTask),
    htmlminTask
));

const serve = (exports.serve = gulp.series(cleanTask, build, browserSyncTask));

const dev = (exports.dev = gulp.series(
    cleanTask,
    gulp.parallel(
        handlebarsTask,
        postCssTask,
        createCopyTask(srcDir.js, distDir.js),
        createCopyTask(srcDir.img, distDir.img)
    ),
    gulp.parallel(watchDevTask, browserSyncTask)
));

exports.start = process.env.NODE_ENV === 'production' ? serve : dev;
