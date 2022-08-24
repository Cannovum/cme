import { expect, test } from "@playwright/test"

import { createHomePage } from "./pages/Home"
import { jumpTo } from "./Routes"

test.beforeEach(async ({ page }) => {
	await jumpTo.home(page)
})

test.describe("Via navbar", () => {
	test.describe("Medical education", async () => {
		test("Go to Kurse", async ({ page }) => {
			const homepage = createHomePage(page)

			const cmeStartPage = await homepage.navigateViaNavbar.toCourses(page)

			expect(await cmeStartPage.isCurrentPage()).toBe(true)
		})

		test("Go to Wissensbereich", async ({ page }) => {
			const homepage = createHomePage(page)

			const wissensbereichPage =
				await homepage.navigateViaNavbar.toWissensbereich(page)

			expect(await wissensbereichPage.isCurrentPage()).toBe(true)
		})

		test("Go to Workshops", async ({ page }) => {
			const homepage = createHomePage(page)

			const workshopsPage = await homepage.navigateViaNavbar.toWorkshops(page)

			expect(await workshopsPage.isCurrentPage()).toBe(true)
		})

		test("Go to latest course", async ({ page }) => {
			const homepage = createHomePage(page)

			const coursePage = await homepage.navigateViaNavbar.toLatestCourse(page)

			expect(await coursePage.getTitle()).toBe(
				"Medizinisches Cannabis: Grundlagen"
			)
		})
	})

	// test.describe.skip("About", () => {
	// 	test("About main", async ({ page }) => {
	// 		const homepage = createHomePage(page)

	// 		const aboutPage = await homepage.navigateViaNavbar.toAbout(page)

	// 		expect(await aboutPage.isCurrentPage()).toBe(true)
	// 	})

	// 	test("Lizenzen", async ({ page }) => {
	// 		const homepage = createHomePage(page)

	// 		const aboutPage = await homepage.navigateViaNavbar.toAbout(page)

	// 		expect(await aboutPage.isTextVisible("Unsere Lizenzen")).toBe(true)
	// 	})

	// 	test("Medical Advisory Board", async ({ page }) => {
	// 		const homepage = createHomePage(page)

	// 		const aboutPage = await homepage.navigateViaNavbar.toAbout(page)

	// 		expect(await aboutPage.isTextVisible("Medical Advisory Board")).toBe(true)
	// 	})

	// 	test("Unser Team", async ({ page }) => {
	// 		const homepage = createHomePage(page)

	// 		const aboutPage = await homepage.navigateViaNavbar.toAbout(page)

	// 		expect(await aboutPage.isTextVisible("Unser Team")).toBe(true)
	// 	})

	// 	test("Unsere News", async ({ page }) => {
	// 		const homepage = createHomePage(page)

	// 		const newsPage = await homepage.navigateViaNavbar.toNews(page)

	// 		expect(await newsPage.isCurrentPage()).toBe(true)
	// 	})
	// })
})
