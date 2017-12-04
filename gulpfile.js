let gulp = require('gulp');
let browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');


gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        }
    })
});


gulp.task('autopre', () =>
    gulp.src('app/css/style.css')
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: true
    }))
    .pipe(gulp.dest('app/css'))
);

gulp.task('start', ['browser-sync'], function () {
    gulp.watch('app/css/*.css', browserSync.reload);
    gulp.watch('app/index.html', browserSync.reload);
    gulp.watch('app/js/*.js', browserSync.reload);
});