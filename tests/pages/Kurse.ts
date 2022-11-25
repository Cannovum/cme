import { createKursPage } from "./Kurs"

import type { Page } from "@playwright/test"
import type { Courses } from "../Types"

export function createKursePage(page: Page) {
	return {
		gotoCourse,
	}

	async function gotoCourse(course: Courses) {
		const button = page
			.locator(".cme-kurs-card_text-container", {
				hasText: course,
			})
			.locator("a", { hasText: "Kurs anschauen" })

		await button.click()

		return createKursPage(page)
	}
}
