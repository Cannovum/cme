import { Page } from "@playwright/test"

import { createWissensbereichPage } from "./pages/Wissensbereich"
import { Courses } from "./Types"

const courseURI: Record<Courses, string> = {
	"Medizinisches Cannabis: Grundlagen": "medizinisches-cannabis-grundlagen",
}

export const jumpTo = {
	async wissensbereich(page: Page) {
		await page.goto("https://cannovum.de/cme/wissensbereich")
		return createWissensbereichPage(page)
	},
	async home(page: Page) {
		await page.goto("https://cannovum.de/")

		return //Todo implement home page
	},
	async kurs(page: Page, course: Courses) {
		await page.goto(`https://cannovum.de/kurse/${courseURI[course]}`)
	},
}
