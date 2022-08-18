import { Page } from "@playwright/test"

export function createWissensbereichPage(page: Page) {
	const faq = page.locator("role=[tab]", {
		hasText: "FAQ",
	})
	const literatur = page.locator("role=[tab]", {
		hasText: "literatur",
	})
	const glossar = page.locator("role=[tab]", {
		hasText: "glossar",
	})
	const downloads = page.locator("role=[tab]", {
		hasText: "downloads",
	})
	const searchButton = page.locator("#wissen-search-input")

	return {
		openFAQ() {
			return faq.click()
		},
		openLiteratur() {
			return literatur.click()
		},
		openGlossar() {
			return glossar.click()
		},
		openDownloads() {
			return downloads.click()
		},
		inputSearch() {
			return searchButton.click()
		},
	}
}
