// "autoprefixer-core": "^4.0.0",
// "gulp-postcss": "^3.0.0",
// "gulp-sass": "^1.1.0",
// "postcss-assets": "^0.9.0"

var gulp = require ('gulp')
var browserify = require ('gulp-browserify')
var uglify = require ('gulp-uglify')
var insert = require ('gulp-insert')
var stylus = require ('gulp-stylus') // https://www.npmjs.com/package/gulp-stylus/
var csso = require ('gulp-csso')
var zip = require ('gulp-zip')

var comment = require('fs').readFileSync('./source/header.js')

gulp.task ('js', function () {
  gulp.src ('./source/likely.js')
    .pipe (browserify ())
    .pipe (uglify ())
    .pipe (insert.prepend (comment))
    .pipe (gulp.dest ('../release/'))
})

gulp.task('css', function () {
  gulp.src('./styles/likely.styl')
    .pipe (stylus ())
    .pipe (csso ())
    .pipe (insert.prepend (comment))
    .pipe (gulp.dest ('../release/'))
})

gulp.task ('zip', ['js', 'css'], function () {
  gulp.src([
    '../release/license.txt',
    '../release/likely.css',
    '../release/likely.js',
  ])
    .pipe (zip ('ilya-birman-likely-2.0.zip'))
    .pipe (gulp.dest ('../release/'))
})

gulp.task('default', ['js', 'css', 'zip'], function () {
  gulp.watch ('source/*.js', ['js', 'zip'])
  gulp.watch ('styles/*.styl', ['css', 'zip'])
  gulp.watch ('../release/license.txt', ['zip'])
})