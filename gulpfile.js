var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('autoprefixer');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('images', function(){
    gulp.src('src/images/**/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/images/'));
});

gulp.task('styles', function(){
    gulp.src(['src/styles/**/*.scss'])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(cssnano())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/styles/'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
    return gulp.src('src/scripts/**/*.js')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('default', ['browser-sync'], function(){
    gulp.watch("src/styles/**/*.scss", ['styles']);
    gulp.watch("src/images/**/*", ['images']);
    gulp.watch("src/scripts/**/*.js", ['scripts']);
    gulp.watch("*.html", ['bs-reload']);
});