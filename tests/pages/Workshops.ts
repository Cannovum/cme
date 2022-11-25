import type { Page } from "@playwright/test"

export function createWorkshopsPage(page: Page) {
	const title = page.locator("h1")

	return { isCurrentPage }

	async function isCurrentPage(): Promise<boolean> {
		return (await title.innerText()) === "Medical Education"
	}
}
