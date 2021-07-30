const Bundler = require("parcel-bundler")
const Path = require("path")

const entryFiles = Path.join(__dirname, "./src/app.js")
const options = {
  outDir: "./dist",
  outFile: "cme.js",
  target: "browser",
  watch: false,
  contentHash: false,
  minify: false,
}

;(async function () {
  const bundler = new Bundler(entryFiles, options)
  const bundle = await bundler.bundle()
})()
