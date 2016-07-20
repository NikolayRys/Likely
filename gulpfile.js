/* eslint-env node */

const gulp = require('gulp');
const stylus = require('gulp-stylus');
const csso = require('gulp-csso');
const zip = require('gulp-zip');
const webpack = require('webpack-stream');
const env = require('gulp-env');

const packageJson = require('./package.json');

const release = './release/';

function runJsTaskWithEnv(environment) {
    var envs = env.set({
        NODE_ENV: environment,
    });

    return gulp.src('./source/likely.js')
        .pipe(envs)
        // Local `require` is used to require the config with the previously set NODE_ENV
        // eslint-disable-next-line global-require
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(envs.reset)
        .pipe(gulp.dest(release));
}

gulp.task('js-dev', function () {
    return runJsTaskWithEnv('development');
});

gulp.task('js-prod', function () {
    return runJsTaskWithEnv('production');
});

gulp.task('css', function () {
    return gulp.src('./styles/likely.styl')
        .pipe(stylus())
        .pipe(csso())
        .pipe(gulp.dest(release));
});

gulp.task('zip', ['js-prod', 'css'], function () {
    var version = packageJson.version;

    return gulp.src([
        release + 'license.txt',
        release + 'likely.css',
        release + 'likely.js',
    ])
        .pipe(zip('ilya-birman-likely-' + version + '.zip'))
        .pipe(gulp.dest(release));
});

gulp.task('build', ['js-prod', 'css']);

gulp.task('dev', ['js-dev', 'css'], function () {
    gulp.watch('source/**/*.styl', ['css']);
    // JS is watched by Webpack in `webpack.config.js`
});

gulp.task('default', ['build', 'zip']);
