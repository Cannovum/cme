import { expect, test } from "@playwright/test"

import { createWissensbereichPage } from "./pages/Wissensbereich"
import { jumpTo } from "./Routes"

test.beforeEach(async ({ page }) => {
	await jumpTo.wissensbereich(page)
})

test.describe("FAQ", () => {
	test("should be displayed after clicking the FAQ button", async ({
		page,
	}) => {
		const wissensbereichPage = createWissensbereichPage(page)

		expect(await wissensbereichPage.getCurrentTabTitle()).toEqual("FAQ")
	})
})

test.describe("downloads", () => {
	test("should display a login to download button", async ({ page }) => {
		const wissensbereich = createWissensbereichPage(page)

		await wissensbereich.openDownloads()

		expect(await wissensbereich.downloads.areItemsLocked()).toBe(true)
	})
})

test.describe.skip("Search feature", () => {
	test.skip("Receieves input", async ({ page }) => {
		const wissensbereich = await jumpTo.wissensbereich(page)
	})
})
