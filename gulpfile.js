const gulp = require('gulp');
const browserSync = require('browser-sync').create();

// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);
});

gulp.task('mytask', async function() {
    console.log('Hi from gulp-task');
});