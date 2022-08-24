import { createCMEStartPage } from "./CMEStart"
import { createCoursePage } from "./Course"
import { createShopPage } from "./Shop"
import { createWissensbereichPage } from "./Wissensbereich"
import { createWorkshopsPage } from "./Workshops"

import type { Page } from "@playwright/test"
export function createMainNavigation(basePage: Page, isMobile = false) {
	const medicalEducation = basePage.locator(
		`#main-nav ${isMobile ? ".navigation-mob.w-nav" : ".navigation.w-nav"}`,
		{
			hasText: "medical education",
		}
	)
	const kurse = medicalEducation.locator("text=kurse")
	const wissensbereich = medicalEducation.locator("text=wissensbereich")
	const workshops = medicalEducation.locator("text='Workshops'")
	const latestCourse = medicalEducation.locator("text=Jetzt ansehen")

	const aboutNavItem = basePage.locator("[role=navigation]", {
		hasText: "Über uns",
	})
	const lizenzen = aboutNavItem.locator("text=Lizenzen")
	const medicalBoard = aboutNavItem.locator("text=Medical Advisory Board")
	const team = aboutNavItem.locator("text=Team")
	const news = aboutNavItem.locator("text=news")
	const karriere = aboutNavItem.locator("text=karriere")

	const serviceNavItem = basePage.locator("[role=navigation]", {
		hasText: "Service",
	})
	const serviceHotline = basePage.locator("text=0521 800 698 92")
	const liveBestand = basePage.locator("text=Live Bestand")
	const kontakt = basePage.locator("text=kontakt")

	const investorNavItem = basePage.locator("[role=navigation]", {
		hasText: "Investor Relations",
	})

	const languageNavItem = basePage.locator("[role=navigation]", {
		hasText: "DE",
	})
	const german = basePage.locator("text=German")
	const english = basePage.locator("text=English")

	const shopNavButton = basePage.locator("[role=navigation]", {
		hasText: "Shop",
	})

	return {
		navigateViaNavbar: {
			async toShop(page: Page) {
				await shopNavButton.click()

				return createShopPage(page)
			},
			async toCMEStart(page: Page) {
				await medicalEducation.click()

				return createCMEStartPage(page)
			},
			async toWissensbereich(page: Page) {
				await medicalEducation.hover()

				await wissensbereich.click()

				return createWissensbereichPage(page)
			},
			async toCourses(page: Page) {
				await medicalEducation.hover()
				await kurse.click()

				return createCMEStartPage(page)
			},
			async toWorkshops(page: Page) {
				await medicalEducation.hover()

				await workshops.click()

				return createWorkshopsPage(page)
			},
			async toLatestCourse(page: Page) {
				await medicalEducation.hover()

				await latestCourse.click()

				return createCoursePage(page)
			},
		},
	}
}
