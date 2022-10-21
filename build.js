require("dotenv/config")

const signale = require("signale-logger")

const { promises: fs } = require("node:fs")
const { Parcel } = require("@parcel/core")
const path = require("path")

const entries = [
	path.join(__dirname, "./src/cme.js"),
	path.join(__dirname, "./src/login.js"),
	path.join(__dirname, "./src/test_env.js"),
	path.join(__dirname, "./src/knowledgebase/knowledgebase.js"),
	path.join(__dirname, "./src/investor_relations.js"),
]

const bundler = new Parcel({
	entries,
	defaultConfig: "@parcel/config-default",
	mode: "production",
	minify: false,
})

bundler.watch((error, event) => {
	if (error) {
		signale.fatal(new Error("Build faled"))
		signale.fatal(error)
		throw error
	}

	if (event.type === "buildSuccess") {
		let bundles = event.bundleGraph.getBundles()
		signale.success(
			`✨ Built ${bundles.length} bundles in ${event.buildTime}ms!`
		)

		copyDir("./dist", process.env.BROWSER_OVERRIDE_DIRECTORY)
	} else if (event.type === "buildFailure") {
		signale.alert(event.diagnostics)
	}
})

async function copyDir(src, dest) {
	await fs.mkdir(dest, { recursive: true })
	let entries = await fs.readdir(src, { withFileTypes: true })

	for (let entry of entries) {
		let srcPath = path.join(src, entry.name)
		let destPath = path.join(dest, entry.name)

		entry.isDirectory()
			? await copyDir(srcPath, destPath)
			: await fs.copyFile(srcPath, destPath)
	}
}
