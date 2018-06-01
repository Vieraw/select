import gulp from 'gulp';
import watch from 'gulp-watch';
import clean from 'gulp-clean';
import sourcemaps from 'gulp-sourcemaps';
import notify from 'gulp-notify';

import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import cleanCSS from 'postcss-clean';
import cssnext from 'postcss-cssnext';

import browserify from 'browserify';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';

const dest = './view/';

const path =
    {
        source:
            {
                scss: './src/style/',
                es: './src/js/',
                image: './src/image/'
            },
        build:
            {
                css: dest + '/style/',
                js: dest + '/js/',
                image: dest + '/image/'
            }
    };

const processors =
    [
        cssnext({browsers: 'last 2 versions'}),
        cleanCSS({compatibility: 'ie9+'})
    ];

//SCSS

gulp.task('scss', () =>
    gulp.src(path.source.scss + 'main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', notify.onError(
            {
                message: '<%= error.message %>',
                title: 'Sass Error!'
            })))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.', {includeContent: true, sourceRoot: path.source.scss}))
        .pipe(gulp.dest(path.build.css))
        .pipe(notify('The assembly of CSS files is completed.'))
);

//ECMAScript

gulp.task('babel', () =>
    browserify({entries: path.source.es + 'main.js', debug: true})
        .transform('babelify')
        .bundle().on('error', notify.onError(
        {
            message: '<%= error.message %>',
            title: 'Sass Error!'
        }))
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.', {includeContent: true, sourceRoot: path.source.es}))
        .pipe(gulp.dest(path.build.js))
        .pipe(notify('The assembly of JS files is completed.'))
);

//Image

gulp.task('image', () =>
    gulp.src(path.source.image + '**/*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }).on('error', notify.onError(
            {
                message: '<%= error.message %>',
                title: 'Imagemin Error!'
            })))
        .pipe(gulp.dest(path.build.image))
        .pipe(notify('The image is compressed.'))
);


//Watch
gulp.task('watch', () =>
    {
        watch([path.source.scss], () =>
            gulp.start('scss')
        );
        watch([path.source.es], () =>
            gulp.start('babel')
        );
        watch([path.source.image], () =>
            gulp.start('image')
        );
    }
);

//Build
gulp.task('clean', () =>
    gulp.src(dest, {read: false})
        .pipe(clean())
);

gulp.task('build', ['clean'], () =>
{
    gulp.start('scss');
    gulp.start('babel');
    gulp.start('image');
});