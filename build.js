const Bundler = require("parcel-bundler")
const Path = require("path")

const entryFiles = [
	Path.join(__dirname, "./src/cme.js"),
	Path.join(__dirname, "./src/global.js"),
]
const options = {
	outDir: "./dist",
	outFile: "cme.js",
	target: "browser",
	minify: false,
	cache: true,
	cacheDir: ".cache",
	hmr: false,
	watch: false,
}

;(async function () {
	const bundler = new Bundler(entryFiles, options)
	const bundle = await bundler.bundle()
})()
