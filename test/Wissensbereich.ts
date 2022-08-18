import { test, expect } from "@playwright/test"
import { goTo } from "./Routes"

test.describe("Search feature", () => {
	test("Receieves input", async ({ page }) => {
		const wissensbereich = await goTo.wissensbereich(page)

    

	})
})
