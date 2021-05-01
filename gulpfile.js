'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
var rename = require('gulp-rename');

const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');

const autoprefixer = require('gulp-autoprefixer');

// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);
});

gulp.task('template-compile', function() {
    return gulp.src('source/templates/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
});

gulp.task('mytask', async function() {
    console.log('Hi from gulp-task');
});



gulp.task('sass-compile', function() {
    return gulp.src('source/styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build/css'));
});

gulp.task('sass:watch', function() {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

var spritesmith = require('gulp.spritesmith');

gulp.task('sprite', function(cb) {
    var spriteData = gulp.src('source/img/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../img/sprite.png',
        cssName: 'sprite.scss'
    }));
    spriteData.img.pipe(gulp.dest('build/img/'));
    spriteData.css.pipe(gulp.dest('source/css/global/'));
    cb();
});

var rimraf = require('rimraf');
const { watch } = require('browser-sync');

gulp.task('clean', function(cb) {
    return rimraf('build', cb);
});

gulp.task('copy-images', function() {
    return gulp.src('./source/img/**/*.*')
        .pipe(gulp.dest('build/img'));
});

gulp.task('copy-fonts', function() {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});

gulp.task('watch', function() {
    gulp.watch('source/templates/**/*.pug', gulp.series('template-compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('sass-compile'));

});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('template-compile', 'sass-compile', 'sprite', 'copy-images', 'copy-fonts'),
    gulp.parallel('watch', 'server')
));