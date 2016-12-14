/* eslint-env node */

const gulp = require('gulp');
const zip = require('gulp-zip');

const packageJson = require('./package.json');

const release = './release/';

gulp.task('zip', () => {
    var version = packageJson.version;

    return gulp.src([
        `${release}'license.txt`,
        `${release}'likely.css`,
        `${release}'likely.js`,
    ])
        .pipe(zip(`ilya-birman-likely-${version}.zip`))
        .pipe(gulp.dest(release));
});

gulp.task('default', ['zip']);
