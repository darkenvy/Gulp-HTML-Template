var gulp       = require('gulp'),
    babel      = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify     = require('gulp-uglify'),
    sass       = require('gulp-sass'),
    htmlmin    = require('gulp-htmlmin'),
    rename     = require('gulp-rename'),
    webserver  = require('gulp-webserver');

var appSrc     = 'src/',
    appOut     = 'dist/';


// ------------------------------------ //
//       Development Compilation
// ------------------------------------ //


gulp.task('sass', function() {
  return gulp
    .src(appSrc + 'sass/**/*.scss')
    .pipe(sass()
    .on('error', sass.logError))
    .pipe(gulp.dest(appOut + 'css/'));
});

gulp.task('babel', function() {
  return gulp.src(appSrc + 'es6/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(rename(path => path.extname = '.js'))
  .pipe(sourcemaps.write('maps/'))
  .pipe(gulp.dest(appOut + 'js/.'));
});

gulp.task('html-move', function() {
  return gulp.src(appSrc + '**/*.html')
    .pipe(gulp.dest(appOut + '.'));
});

// ------------------------------------ //
//       Deployment Compilation
// ------------------------------------ //


gulp.task('deploy-sass', function() {
  return gulp
    .src(appSrc + 'sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'})
    .on('error', sass.logError))
    .pipe(gulp.dest(appOut + 'css/'));
});

gulp.task('deploy-babel', function() {
  return gulp.src(appSrc + 'es6/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(uglify())
  .pipe(rename(path => path.extname = '.js'))
  .pipe(sourcemaps.write('maps/'))
  .pipe(gulp.dest(appOut + 'js/.'));
});

gulp.task('html-minify', function() {
  return gulp.src(appSrc + '**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(appOut + '.'));
});

// ------------------------------------ //
//              Webserver
// ------------------------------------ //

// --- Update Changes to Webserver --- //

gulp.task('html', function() {
  gulp.src(appOut + '**/*.html');
});

gulp.task('css', function() {
  gulp.src(appOut + 'css/*.css');
});

gulp.task('js', function() {
  gulp.src(appOut + 'js/*.js');
});

// --- Watch and Webserve --- //

gulp.task('watch', function() {
  gulp.watch(appOut + '**/*.html', ['html'])
  gulp.watch(appSrc + 'sass/*.scss', ['sass', 'css']);
  gulp.watch(appSrc + 'es6/*.js',  ['babel','js']);
});

gulp.task('webserver', function() {
  gulp.src(appOut)
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

// ------------------------------------ //
//                Tasks
// ------------------------------------ //

// gulp.task('default', ['html-move']);
gulp.task('default', ['babel', 'sass', 'html-move', 'watch', 'webserver']);
gulp.task('deploy', ['deploy-babel', 'deploy-sass', 'html-minify'])