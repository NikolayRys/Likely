'use strict';

var gulp = require('gulp');
var insert = require('gulp-insert');
var stylus = require('gulp-stylus');
var csso = require('gulp-csso');
var zip = require('gulp-zip');
var webpack = require('webpack-stream');

var packageJson = require('./package.json');
var webpackConfig = require('./webpack.config.js');

var release = './release/';

function comment(version) {
    return [
        '//! Likely $version by Ilya Birman (ilyabirman.net)',
        '//! Rewritten sans jQuery by Evgeny Steblinsky (volter9.github.io)',
        '//! Supported by Ivan Akulov (iamakulov.com), Viktor Karpov (vitkarpov.com), and contributors',
        '//! Inspired by Social Likes by Artem Sapegin (sapegin.me)',
    ].join('\n').replace(/\$version/g, version);
}

gulp.task('js', function () {
    var version = packageJson.version;

    return gulp.src('./source/likely.js')
        .pipe(webpack(webpackConfig))
        .pipe(insert.prepend(comment(version) + '\n'))
        .pipe(gulp.dest(release));
});

gulp.task('css', function () {
    return gulp.src('./styles/likely.styl')
        .pipe(stylus())
        .pipe(csso())
        .pipe(gulp.dest(release));
});

gulp.task('zip', ['js', 'css'], function () {
    var version = packageJson.version;

    return gulp.src([
        release + 'license.txt',
        release + 'likely.css',
        release + 'likely.js',
    ])
        .pipe(zip('ilya-birman-likely-' + version + '.zip'))
        .pipe(gulp.dest(release));
});

gulp.task('build', ['js', 'css']);

gulp.task('default', ['js', 'css', 'zip'], function () {
    gulp.watch('source/*.js', ['zip']);
    gulp.watch('source/services/*.js', ['zip']);
    gulp.watch('styles/*.styl', ['zip']);
    gulp.watch('license.txt', ['zip']);
});
