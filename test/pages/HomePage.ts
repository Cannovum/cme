import { Page, BrowserContext } from "@playwright/test"

function createMainNavPage(page: Page, context: BrowserContext) {
	const heroButton = page.locator("a", {
		hasText: "Über uns",
	})

	return {
		clickHeroButton() {
			return //! Implement page to return
		},
		toMedicalEducation() {
			return //! Implement page to return
		},
	}
}
