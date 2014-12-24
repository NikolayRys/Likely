    // "autoprefixer-core": "^4.0.0",
    // "gulp-postcss": "^3.0.0",
    // "gulp-sass": "^1.1.0",
    // "postcss-assets": "^0.9.0"

var gulp = require ('gulp')
var stylus = require ('gulp-stylus') // https://www.npmjs.com/package/gulp-stylus/
var uglify = require ('gulp-uglify')
var svgo = require ('gulp-svgo');

/*
var replace = require ('gulp-replace')  // https://www.npmjs.com/package/gulp-replace/

gulp.task ('sass', function () {
  gulp.src (['sass/*.scss', '!sass/_*.scss'])
    .pipe (sass ({
      outputStyle: 'compressed',
    }))
    .pipe (postcss ([
      require ('autoprefixer-core')({
        browsers: ['last 1 version', 'last 2 Explorer versions']
      }),
      require ('postcss-assets')({
        basePath: 'images/',
        baseUrl: '/system/theme/',
        inline: { maxSize: '52K' }
      })
    ]))
    .pipe(gulp.dest('styles/'))
})

gulp.task ('uglify', function () {
  gulp.src (['emerge.js'])
    .pipe (replace (/^( *).*\/\/\:dev.*$/gm, '$1// dev code removed //'))
    .pipe (gulp.dest ('../verify/'))
    .pipe (uglify ({preserveComments: 'some'}))
    .pipe (gulp.dest ('../release/'))
})

*/

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
    .pipe (gulp.dest ('.'))
    .pipe (gulp.dest ('../release/'))
})


gulp.task ('default', ['stylus','uglify','svgo'], function () {
  gulp.watch ('likely.js', ['uglify'])
  gulp.watch ('styles/*.styl', ['stylus'])
  gulp.watch ('icons_svg/*', ['svgo'])
})
