import type { Page } from "@playwright/test"

export function createCoursePage(page: Page) {
	const title = page.locator("h1")

	return { getTitle }

	async function getTitle(): Promise<string> {
		return title.innerText()
	}
}
