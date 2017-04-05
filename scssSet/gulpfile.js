/**
 * Created by yy on 2016/5/4.
 */
// 加载插件
var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'), //压缩css插件
    notify = require('gulp-notify'),    //更改提醒插件
    sass = require('gulp-ruby-sass'),   //编译scss插件
    //处理后存放的位置
    cssPath = "dist/css";

// 压缩CSS
gulp.task('css', function () {
    return gulp.src('css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8', debug: true}, function (details) {
            console.log(details.name + 'before:' + details.stats.originalSize); //打印压缩前size
            console.log(details.name + 'after:' + details.stats.minifiedSize); //打印压缩后size
        }))
        .pipe(gulp.dest(cssPath))
        .pipe(notify({message: 'css ok'}));
});

//编译sass
gulp.task('sass', function () {
    return sass('scss/style.scss')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(gulp.dest('css'))
        .pipe(notify({message: 'scss ok'}));
})

// 监听所有文件
gulp.task('auto', function () {
// Watch .scss files
    gulp.watch('css/*.css', ['css']);
// watch scss files
    gulp.watch('scss/*.scss', ['sass']);
});

//默认任务
gulp.task('default', function () {
    //监听有修改，就自动压缩
    gulp.start(['css', 'auto'], ['sass', 'auto']);
});
