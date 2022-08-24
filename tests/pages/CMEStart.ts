import type { Page } from "@playwright/test"

export function createCMEStartPage(page: Page) {
	const titel = page.locator("h1")

	return {
		isCurrentPage,
	}

	async function isCurrentPage(): Promise<boolean> {
		return (await titel.innerText()) === "Kurse"
	}
}
