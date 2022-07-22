const { src, dest, watch, series, parallel } = require('gulp'); // requerimos de gulp las funciones de src source que identifica el archivo y dest que inidica donde queremos guardar el archivo

// CSS Y SASS
const sass = require('gulp-sass')(require('sass')); // sass es utilizado para compilar el archivo .scss y convertirlo en .css
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// IMAGENES
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');


function css(done) {
    // COMPILAR SASS
    // PASOS: 1- identificar el archivo / 2- compilar la hoja scss / 3- guardar el archivo .css
    src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css/'))
    done();
    //outpotStyle crea el .css comprimido
    // postcss y autoprefixer configurados en el pck.json crea una version compatible para los navegadores en este caso para la ultima version del navegador y para lo que se usa mas del 1%
}
function versionWebp() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}') //filtramos solo dos formatos que soporta la libreria webp
        .pipe(webp(opciones))
        .pipe(dest('build/img/'))
}
function versionAvif() {
    const opciones = {//declaramos una variable con la mitad de calidad que sale la imagen
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones)) // aqui colocamos la calidad al 50%
        .pipe(dest('build/img/'));
}
function imagenes() {
    return src('src/img/**/*') // **/* es todos los archivos sin diferencia extensiones--- return por done
        .pipe(imagemin({optimizationLevel: 3}))
        .pipe(dest('build/img/'));
   
}
function dev() {
    watch('src/scss/**/*.scss', css); // comodin **/*.scss para que vea los cambios en todos las carpetas que contengan la extension .scss
    watch('src/img/**/*', imagenes);
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
// exports.default = series(imagenes, versionWebp, versionAvif, css, dev);
exports.default = dev;

//series-- ejecuta la primer tarea y cuando la termina ejecuta la proxima tarea

//parallel-- se inician todas las tareas al mismo tiempo y van terminando de manera diferente