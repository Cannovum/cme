require("dotenv/config")

const c = require("ansi-colors")

const { promises: fs } = require("node:fs")
const Bundler = require("parcel-bundler")
const path = require("path")

const entryFiles = [
	path.join(__dirname, "./src/cme.js"),
	path.join(__dirname, "./src/login.js"),
	path.join(__dirname, "./src/test_env.js"),
	path.join(__dirname, "./src/knowledgebase/knowledgebase.js"),
]

const options = {
	outDir: "./dist",
	outFile: "cme.js",
	target: "browser",
	minify: true,
	cache: true,
	cacheDir: ".cache",
	hmr: false,
	watch: false,
}

;(async () => {
	const bundler = new Bundler(entryFiles, options)
	const bundle = await bundler.bundle()

	await copyDir("./dist/", process.env.BROWSER_OVERRIDE_DIRECTORY)
})()

async function copyDir(src, dest) {
	console.log(`Copying files to ${c.gray(dest)}`)

	await fs.mkdir(dest, { recursive: true })
	let entries = await fs.readdir(src, { withFileTypes: true })

	for (let entry of entries) {
		let srcPath = path.join(src, entry.name)
		let destPath = path.join(dest, entry.name)

		entry.isDirectory()
			? await copyDir(srcPath, destPath)
			: await fs.copyFile(srcPath, destPath)
	}
	console.log(c.green(`Finished copying files to ${c.gray(dest)}`))
}
