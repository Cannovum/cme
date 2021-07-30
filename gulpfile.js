const gulp = require("gulp")
const terser = require("gulp-terser")
const git = require("gulp-git")
const source = require("vinyl-source-stream")
const buffer = require("vinyl-buffer")
const rollupStream = require("@rollup/stream")
const yargs = require("yargs")
const { src, series, parallel, dest, watch } = require("gulp")

// const jsPath = "src/*.js"
const distPath = "./dist"

function js() {
  const options = {
    input: "./src/app.js",
    output: { format: "iife" },
  }
  return rollupStream(options)
    .pipe(source("cme.js"))
    .pipe(buffer())
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

// exports.js = js()
// exports.default = series(parallel(js), add(), commit("Test"), push("dev"))

const options = {
  input: "./src/app.js",
  output: { format: "iife" },
}
console.log(
  rollupStream(options).on("end", (e) => {
    console.log(e)
  })
)
