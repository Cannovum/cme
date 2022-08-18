import { test, expect, Page, BrowserContext } from "@playwright/test"

export function createMainNavPage(page: Page, context: BrowserContext) {
	const medicalEducation = page.locator("#main-nav", {
		hasText: "medical education",
	})
	const kurse = medicalEducation.locator("text=kurse")
	const wissensbereich = medicalEducation.locator("text=wissensbereich")
	const workshops = medicalEducation.locator("text=workshops")
	const cannabisGrundlagen = medicalEducation.locator(
		"text=Medizinisches Cannabis: Grundlagen"
	)

	const aboutNavItem = page.locator("[role=navigation]", {
		hasText: "Über uns",
	})
	const lizenzen = aboutNavItem.locator("text=Lizenzen")
	const medicalBoard = aboutNavItem.locator("text=Medical Advisory Board")
	const team = aboutNavItem.locator("text=Team")
	const news = aboutNavItem.locator("text=news")
	const karriere = aboutNavItem.locator("text=karriere")

	const serviceNavItem = page.locator("[role=navigation]", {
		hasText: "Service",
	})
	const serviceHotline = page.locator("text=0521 800 698 92")
	const liveBestand = page.locator("text=Live Bestand")
	const kontakt = page.locator("text=kontakt")

	const investorNavItem = page.locator("[role=navigation]", {
		hasText: "Investor Relations",
	})

	const languageNavItem = page.locator("[role=navigation]", { hasText: "DE" })
	const german = page.locator("text=German")
	const english = page.locator("text=English")

	const shopNavButton = page.locator("[role=navigation]", { hasText: "Shop" })

	return {
		navigateViaNavbar: {
			toShop() {
				return shopNavButton.click()
			},
			toMedicalEducation() {
				return medicalEducation.click()
			},
		},
	}
}
