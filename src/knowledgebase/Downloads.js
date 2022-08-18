export default async function modifyDownloadCards() {
	const tablesOfContent = document.querySelectorAll("[data-cme-download-toc]")

	if (!tablesOfContent) return

	for (const toc of tablesOfContent) {
		const titles = toc.innerText.split("/").map((text) => text.trim())

		toc.replaceChildren() // Remove the children

		// Recreate them from the titles array
		for (const title of titles) {
			const div = document.createElement("div")
			div.innerText = title
			div.style.whiteSpace = "nowrap"
			toc.appendChild(div)
		}
	}
}
