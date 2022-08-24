import { createAboutPage } from "./About"
import { createMainNavigation } from "./MainNav"

import type { Page } from "@playwright/test"

export function createHomePage(page: Page) {
	const heroButton = page.locator(".hero", {
		hasText: "Über uns",
	})

	return {
		...createMainNavigation(page),

		async clickHeroButton() {
			await heroButton.click()
			return createAboutPage(page)
		},
		toMedicalEducation() {
			return //! Implement page to return
		},
	}
}
