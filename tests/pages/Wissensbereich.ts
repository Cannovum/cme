import { Page } from "@playwright/test"

interface IDownloadItem {
	readonly title: string
	readonly button: IDownloadButtonText
}

type IDownloadButtonText = "Login zum Download" | "Download"

export function createWissensbereichPage(page: Page) {
	const title = page.locator("h1")

	const tabTitle = page.locator("h2")

	const faqTabButton = page.locator("role=[tab]", {
		hasText: "FAQ",
	})
	const literaturTabButton = page.locator("role=[tab]", {
		hasText: "literatur",
	})
	const glossarTabButton = page.locator("role=[tab]", {
		hasText: "glossar",
	})
	const downloadsTabButton = page.locator("role=[tab]", {
		hasText: "downloads",
	})
	const searchButton = page.locator("#wissen-search-input")

	const downloads = page.locator("[data-w-tab=Downloads]")
	const downloadsList = downloads.locator("role=list")

	return {
		openFAQ() {
			return faqTabButton.click()
		},
		openLiteratur() {
			return literaturTabButton.click()
		},
		openGlossar() {
			return glossarTabButton.click()
		},
		openDownloads() {
			return downloadsTabButton.click()
		},
		inputSearch() {
			return searchButton.click()
		},
		isCurrentPage,
		getCurrentTabTitle() {
			return tabTitle.innerText()
		},
		downloads: {
			getItems: getDownloadItems,
			areItemsLocked: areDownloadItemsLocked,
		},
	}

	async function isCurrentPage(): Promise<boolean> {
		return (await title.innerText()) === "Wissensbereich"
	}

	async function getDownloadItems(): Promise<IDownloadItem[]> {
		const items: IDownloadItem[] = await downloadsList.evaluateAll((list) =>
			list.map((element) => {
				const title = element.querySelector("h2")?.innerText

				const button = element.querySelector(".button")?.textContent

				if (!title) {
					throw new Error(`Download item title is not valid: ${title}`)
				}
				if (!isDownloadButtonText(button)) {
					throw new Error(`Download item button text is not valid: ${button}`)
				}

				return { title, button }
			})
		)
		return items
	}

	async function areDownloadItemsLocked(): Promise<boolean> {
		const items: IDownloadItem[] = await getDownloadItems()

		const isLocked = items.every((item) => item.button === "Login zum Download")

		return isLocked
	}
}

function isDownloadButtonText(text: unknown): text is IDownloadButtonText {
	if (
		(text as IDownloadButtonText) !== "Download" ||
		(text as IDownloadButtonText) !== "Login zum Download"
	)
		return false

	return true
}
