const gulp = require("gulp")
const concat = require("gulp-concat")
const terser = require("gulp-terser")
const sourcemaps = require("gulp-sourcemaps")
const { src, series, parallel, dest, watch } = require("gulp")

const jsPath = "src/*.js"
const distPath = "dist/"

function jsTask() {
  return src(jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat("cme.js"))
    .pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(dest(distPath))
}

exports.jsTask = jsTask()
exports.default = parallel(jsTask)
