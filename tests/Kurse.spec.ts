import { expect, test } from "@playwright/test"

import { jumpTo } from "./Routes"

test.describe.skip("Watch courses", () => {
	test("Login", async ({ page }) => {
		const wissensbereich = await jumpTo.wissensbereich(page)
	})
})
