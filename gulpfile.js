var fs = require("fs");
var browserify = require("browserify");

var gulp = require("gulp");

var babelify = require("babelify");

var watchify = require("watchify");

var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');




function compile(watch) {
    var bundler = watchify(browserify("./public/js/src/app.js",{ debug: true })
        .transform(babelify, {presets: ["es2015", "react"]}));



    function rebundle() {
        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end'); })
            //.pipe(fs.createWriteStream("public/js/build/app.js"));
            .pipe(source('build.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./public/js/build'));
    }

    if (watch) {
        bundler.on('update', function() {
            console.log('-> bundling...');
            rebundle();
        });
    }

    return rebundle();
}

function watch() {
    return compile(true);
};

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['watch']);