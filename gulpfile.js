"use strict";

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    plumber = require("gulp-plumber"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    minify = require("gulp-csso"),
    rename = require("gulp-rename"),
    imagemin = require("gulp-imagemin"),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    webp = require("gulp-webp"),
    svgstore = require("gulp-svgstore"),
    posthtml = require("gulp-posthtml"),
    include = require("posthtml-include"),
    del = require("del"),
    server = require("browser-sync").create(),
    run = require("run-sequence"),
    svgmin = require("gulp-svgmin"),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    reporter = require('postcss-reporter'),
    syntax_scss = require('postcss-scss'),
    stylelint = require('stylelint');

// Чистка свг, в сборку включать не надо
gulp.task("svgmin", function () {
  return gulp.src("source/img/svg/*.svg")
    .pipe(svgmin())
    .pipe(gulp.dest("source/img/svg-post"));
});

gulp.task("scss-lint", function() {
  var stylelintConfig = {
    "extends": "stylelint-config-htmlacademy",
  }
  var processors = [
    stylelint(stylelintConfig),
    reporter({
     })
  ];

  return gulp.src(
      ["source/sass/**/*.scss"]
    )
    .pipe(postcss(processors, {syntax: syntax_scss}));
  });

gulp.task("style", function() {
  gulp.src([
    "node_modules/slick-carousel/slick/slick-theme.scss",
    "node_modules/slick-carousel/slick/slick.scss",
    "source/sass/style.scss"
    ])
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(concat("style.min.css"))
    .pipe(minify())
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe((imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imageminJpegRecompress({
      loops: 4,
      min: 65,
      max: 85,
      quality:'high'
      }),
      imagemin.svgo()
      ], {
      verbose: true
      })))
    .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function () {
  return gulp.src("source/img/s-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("scripts", function() {
  return gulp.src([
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/slick-carousel/slick/slick.min.js",
    "source/js/*.js"
    ])
    .pipe(concat("build.js"))
    .pipe(uglify())
    .pipe(gulp.dest("build/js"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/*.html", ["html"]);
  gulp.watch("source/js/*.js", ["scripts"]);
});

gulp.task("build", function (done) {
  run("clean", "copy", "style", "webp", "images", "sprite", "scripts", "html", done);
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/**/*.html"
  ], {
    base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});
