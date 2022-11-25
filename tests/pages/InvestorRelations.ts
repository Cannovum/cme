import { createMainNavigation } from "./MainNav"

import type { Page } from "@playwright/test"

export function createInvestorRelationsPage(page: Page) {
	return {
		...createMainNavigation(page),
	}
}
