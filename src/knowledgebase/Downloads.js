export default async function modifiyDownloadCards() {
	const tablesOfContent = document.querySelectorAll("[data-cme-download-toc]")

	if (!tablesOfContent) return

	for (const toc of tablesOfContent) {
		const titles = toc.innerText.split("/").map((text) => text.trim())

		toc.replaceChildren()
		for (const title of titles) {
			const div = document.createElement("div")
			div.innerText = title
			div.style.marginRight = "16px"
			div.style.whiteSpace = "nowrap"
			toc.appendChild(div)
		}
	}
}
