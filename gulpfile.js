const gulp = require("gulp")
const concat = require("gulp-concat")
const terser = require("gulp-terser")
const sourcemaps = require("gulp-sourcemaps")
const git = require("gulp-git")
const yargs = require("yargs")
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

function add() {
  return src("./*").pipe(git.add())
}

function commit(message) {
  return src("./*").pipe(git.commit(message))
}

function push(branch = "dev") {
  return src("./*").pipe(git.push("origin", branch, errFunction))
}

const errFunction = (err) => {
  if (err) throw err
}

exports.jsTask = jsTask()
exports.default = series(parallel(jsTask), add(), commit("Test"), push("dev"))
