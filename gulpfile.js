const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer'); 
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier');

function html() {
    const options = {
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      sortClassName: true,
      useShortDoctype: true,
      collapseWhitespace: true,
        minifyCSS: true,
        keepClosingSlash: true
    };
  return gulp.src('src/**/*.html')
        .pipe(plumber())
                .on('data', function(file) {
              const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options))
              return file.contents = buferFile
            })
                .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function css() {
  const plugins = [
      autoprefixer(),
      mediaquery(),
      cssnano()
  ];
  return gulp.src('src/blocks/**/*.css')
        .pipe(plumber())
        .pipe(concat('bundle.css'))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function images() {
  return gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({stream: true}));
}

function fonts() {
  return gulp.src('src/fonts/**/*.css')
        .pipe(plumber())
        .pipe(concat('fonts.css'))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function video() {
  return gulp.src('src/video/**/*.{MP4,AVI,MKV,MOV,WMV,FLV,WebM,MPEG,3GP,ASF,DivX,SWF,M2TS,MTS,TS,M4V,MXF,OGV,RM,RMVB,WTV}')
        .pipe(plumber())
        .pipe(gulp.dest('dist/video'))
        .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('dist');
}

const build = gulp.series(clean, gulp.parallel(html, css, images, fonts, video));

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/blocks/**/*.css'], css);
  gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['src/fonts/**/*.css'], fonts);
  gulp.watch(['src/video/**/*.{MP4,AVI,MKV,MOV,WMV,FLV,WebM,MPEG,3GP,ASF,DivX,SWF,M2TS,MTS,TS,M4V,MXF,OGV,RM,RMVB,WTV}'], video);
}
const watchapp = gulp.parallel(build, watchFiles, serve);

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
} 


exports.html = html;
exports.css = css;
exports.images = images;
exports.fonts = fonts;
exports.video = video;
exports.clean = clean;
exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp; 