import { createMainNavigation } from "./MainNav"

import type { Page } from "@playwright/test"

export function createAboutPage(page: Page) {
	return {
		...createMainNavigation(page),
	}
}
