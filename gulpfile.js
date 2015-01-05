    // "autoprefixer-core": "^4.0.0",
    // "gulp-postcss": "^3.0.0",
    // "gulp-sass": "^1.1.0",
    // "postcss-assets": "^0.9.0"

var gulp = require ('gulp')
var stylus = require ('gulp-stylus') // https://www.npmjs.com/package/gulp-stylus/
var uglify = require ('gulp-uglify')
var svgo = require ('gulp-svgo')
var csso = require ('gulp-csso')
var zip = require ('gulp-zip')

gulp.task ('svgo', function () {
  gulp.src (['icons_svg/*'])
    .pipe (svgo ())
    .pipe (gulp.dest ('icons_svgo/'))
})

gulp.task ('uglify', function () {
  gulp.src (['likely.js'])
    .pipe (uglify ({preserveComments: 'some'}))
    .pipe (gulp.dest ('../release/'))
})

gulp.task ('stylus', function () {
  gulp.src (['styles/likely.styl'])
    .pipe (stylus ())
    .pipe (csso ())
    .pipe (gulp.dest ('.'))
    .pipe (gulp.dest ('../release/'))
})

gulp.task ('zip', function () {
  gulp.src (['../release/*'])
    .pipe (zip ('ilya-birman-likely-0.9.zip'))
    .pipe (gulp.dest ('../release/'))
})


gulp.task ('default', ['stylus', 'uglify', 'svgo', 'zip'], function () {
  gulp.watch ('likely.js', ['uglify', 'zip'])
  gulp.watch ('styles/*.styl', ['stylus', 'zip'])
  gulp.watch ('../release/license.txt', ['zip'])
  gulp.watch ('icons_svg/*', ['svgo'])
})
