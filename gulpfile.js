'use strict';

/* ******************************************************************************
0. DEPENDENCIES
*******************************************************************************/

const gulp = require('gulp');                    // gulp core
const gulpIf = require('gulp-if');               // gulp if else, если дев версия то 1, если продакшн, то другое
const plumber = require('gulp-plumber');         // не дает прервать работу gulp из-за ошибок
const notify = require('gulp-notify');           // send notifications to osx
const sourcemaps = require('gulp-sourcemaps');   // sourcemap
const concat = require('gulp-concat');           // объединение файлов
const sass = require('gulp-sass');               // sass compiler
const postcss = require('gulp-postcss');         // postcss
const autoprefixer = require('autoprefixer');    // autoprefixer
const csso = require('gulp-csso');               // minify the css files
const filter = require('gulp-filter');           // для объединения styl и css файлов
const pug = require('gulp-pug');                 // pug compiler
const svgSprite = require('gulp-svg-sprite');    // svg sprites
const browserSync = require('browser-sync');     // server & livereload
const uglify = require("gulp-uglify");           // минификация скриптов
const babel = require('gulp-babel');             // babel

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development'; // NODE_ENV=prodaction gulp сборка на продакшн

/*******************************************************************************
 1. STYLUS TASK
 *******************************************************************************/

gulp.task('styles', function () {
	const f = filter(['src/sass/**/*.sass'], {restore: true});
	return gulp.src(['node_modules/swiper/dist/css/swiper.min.css', 'src/sass/common.sass'])
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sourcemaps.init())
		.pipe(f)
		.pipe(sass())
		.pipe(f.restore)
		.pipe(concat('common.css'))
		.pipe(postcss([
			autoprefixer({browsers: ['last 2 versions']})
		]))
		.pipe(sourcemaps.write())
		.pipe(gulpIf(!isDev, csso()))
		.pipe(gulp.dest('dist/css'))
});

/*******************************************************************************
 2. TEMPLATES TASK
 *******************************************************************************/

gulp.task('templates', function () {
	gulp.src('src/templates/*.pug')
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('dist'))
});

/*******************************************************************************
 3. COPY ASSETS
 *******************************************************************************/

gulp.task('copy', function () {
	gulp.src(['src/index.html', 'src/team.html', 'src/faq.html', 'src/{fonts,i,uploads,lib,data}/**/*', '!src/i/sprites/**/*', '!src/i/sprites/'])
		.pipe(gulp.dest('dist'));
});

/*******************************************************************************
 4. SVG
 *******************************************************************************/

const config = {
	transform: [],
	mode: {
		symbol: {
			dest: '.',
			bust: false,
			sprite: "common.svg",
			example: true
		}
	},
	svg: {
		xmlDeclaration: false
	}
};
gulp.task('svg', function () {
	gulp.src('src/i/sprites/common/*.svg')
		.pipe(svgSprite(config))
		.pipe(gulp.dest('dist/i'));
});

/*******************************************************************************
 5. SCRIPTS
 *******************************************************************************/

gulp.task('scripts-watch', function () {
	gulp.src('src/js/*.js')
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(gulp.dest('dist/js/'));
});

gulp.task('scripts-replace', function () {
	gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/jquery-validation/dist/jquery.validate.min.js',
		'node_modules/jquery.marquee/jquery.marquee.min.js',
		'node_modules/gsap/src/minified/jquery.gsap.min.js',
		'node_modules/gsap/src/minified/plugins/ScrollToPlugin.min.js',
		'node_modules/gsap/src/minified/TweenLite.min.js',
		'node_modules/gsap/src/minified/TimelineLite.min.js'])
		.pipe(gulp.dest('dist/js/'))
});

/*******************************************************************************
 6. BROWSER SYNC
 *******************************************************************************/

gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: "./dist/",
			index: "index.html"
		},
		open: false
	});
});

/*******************************************************************************
 7. START & WATCH
 *******************************************************************************/

gulp.task('watch', function () {
	gulp.watch('src/sass/**/*.sass', ['styles']);
	gulp.watch('src/i/sprites/**/*.svg', ['svg']);
	gulp.watch('src/templates/**/*.pug', ['templates']);
	gulp.watch(['src/i/**', 'src/uploads/**', 'src/fonts/**', 'src/data/**'], ['copy']);
	gulp.watch('src/js/*.js', ['scripts-watch']);
	gulp.watch(['src/sass/**/*.sass', 'src/js/**/*.js', 'src/templates/**/*.pug'], browserSync.reload);
});
gulp.task('default', ['templates', 'styles', 'copy', 'svg', 'scripts-watch', 'scripts-replace', 'browser-sync', 'watch']);
// gulp.task('build', ['templates', 'styles', 'copy', 'svg', 'scripts-nowatch']);
