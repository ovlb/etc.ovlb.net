//
// The gros of this file is copied from Google’s Web Starter Kit and has been
// adopted to suit my needs.
// Get your copy of WSK at https://github.com/google/web-starter-kit
//

'use strict';

import path from 'path';
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import pkg from './package.json';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const dist = 'dist';
const source = 'source';

// Lint JavaScript
gulp.task('lint', () =>
  gulp.src(source + '/scripts/**/*.js')
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failOnError()))
);

// Optimize images
gulp.task('images', () =>
  gulp.src(source + '/img/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(dist + '/img'))
    .pipe($.size({title: 'images'}))
);

// Copy all files from the source folder
gulp.task('copy', () =>
  gulp.src([
    source + '/*/**',
    !source + '/styles/*',
    !source + '/scripts/*',
   'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest(dist))
    .pipe($.size({title: 'copy'}))
);

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 11',
    'last 2 versions',
    '> 1%'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    source + '/styles/**/*.scss',
    source + '/styles/**/*.css'
  ])
    .pipe($.newer('.tmp/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/styles'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(dist + '/styles'));
});

// Concatenate and minify JavaScript.
gulp.task('scripts', () =>
    gulp.src([
      // Note: Since we are not using useref in the scripts build pipeline,
      //       you need to explicitly list your scripts here in the right order
      //       to be correctly concatenated
      './' + source + '/scripts/main.js'
      // Other scripts
    ])
      .pipe($.newer('.tmp/scripts'))
      .pipe($.sourcemaps.init())
      .pipe($.babel())
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('.tmp/scripts'))
      .pipe($.concat('main.min.js'))
      .pipe($.uglify({preserveComments: 'some'}))
      // Output files
      .pipe($.size({title: 'scripts'}))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(dist + '/scripts'))
);


// Clean output directory
gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Watch files for changes & reload
gulp.task('serve', ['scripts', 'styles', 'copy', 'nodemon'], () => {
  browserSync({
    browser: 'google chrome canary',
    notify: false,
    // Customize the Browsersync console logging prefix
    logPrefix: 'ETC',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.o-main-content'],
    // Proxy the Express server
    proxy: 'http://localhost:4000',
    port: 4004
  });

  gulp.watch([source + '/**/*.html'], reload);
  gulp.watch(['views/**/*.pug'], reload);
  gulp.watch([source + '/**/*.md'], ['copy', reload]);
  gulp.watch([source + '/styles/**/*.{scss,css}'], ['styles', 'copy', reload]);
  gulp.watch([source + '/scripts/**/*.js'], ['lint', 'scripts']);
  gulp.watch([source + '/images/**/*'], reload);
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return $.nodemon({
    script: 'app.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1500);
  });
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], () =>
  browserSync({
    notify: false,
    logPrefix: 'ETC',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist',
    port: 3001
  })
);

// Build production files, the default task
gulp.task('default', ['clean'], cb =>
  runSequence(
    'styles',
    ['lint', 'scripts', 'images', 'copy'],
    cb
  )
);
