var sources, destinations, lr, gulp, gutil, jade, styl;

gulp = require('gulp');
jade = require('gulp-jade');
gutil = require('gulp-util');
styl = require('gulp-stylus');
imagemin = require('gulp-imagemin');
pngquant = require('imagemin-pngquant');
uglify = require('gulp-uglify');

sources = {
  jade: "src/jade/**/*.jade",
  styl: "src/styl/**/*.styl",
  img: "src/img/*.*",
  fonts: "src/fonts/*.*",
  js: "src/js/*.*"
};

destinations = {
  html: "build/",
  css: "build/css",
  img: "build/img",
  fonts: "build/fonts",
  js: "build/js"
};

gulp.task("jade", function(event) {
  return gulp.src("src/jade/**/*.jade").pipe(jade({
    pretty: true
  })).pipe(gulp.dest(destinations.html));
});

gulp.task("styl", function(event) {
  return gulp.src("src/styl/**/*.styl").pipe(styl({
    style: "compressed"
  })).pipe(gulp.dest(destinations.css));
});

gulp.task("watch", function() {
  gulp.watch(sources.jade, ["jade"]);
  gulp.watch(sources.styl, ["styl"]);
  gulp.watch(sources.img, ["img"]);
  gulp.watch(sources.fonts, ["fonts"]);
  gulp.watch(sources.js, ["js"]);
  gulp.watch('build/**/*', refresh);
});

gulp.task('serve', function () {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static(__dirname+'/build/'));
  app.listen(4000);
  lr = require('tiny-lr')();
  lr.listen(35729);
});

gulp.task('img', function () {
  gulp.src(sources.img) //Выберем наши картинки
    .pipe(imagemin({ //Сожмем их
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest(destinations.img)) //И бросим в build
});

gulp.task('fonts', function() {
    gulp.src(sources.fonts)
      .pipe(gulp.dest(destinations.fonts))
});

gulp.task('js', function() {
    gulp.src(sources.js)
      .pipe(uglify()) //Сожмем наш js
      .pipe(gulp.dest(destinations.js))
});



gulp.task("default", ["jade", "styl", "watch", "serve", "fonts", "js"]);

refresh = function(event) {
  var fileName = require('path').relative(__dirname, event.path);
  gutil.log.apply(gutil, [gutil.colors.magenta(fileName), gutil.colors.cyan('built')]);
  lr.changed({
    body: { files: [fileName] }
  });
}