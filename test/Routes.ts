import { Page } from "@playwright/test"
import { createWissensbereichPage } from "./pages/WissensbereichPage"

export const routes = {
	home: "https://cannovum.de",
} as const

export const goTo = {
	async wissensbereich(page: Page) {
		await page.goto("https://cannovum.de/cme/wissensbereich")
		return createWissensbereichPage(page)
	},
}
