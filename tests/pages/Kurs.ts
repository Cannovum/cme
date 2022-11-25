import type { Page } from "@playwright/test"

export function createKursPage(page: Page) {
	const dcPassword = page.locator("#dc_password")
	const dcUser = page.locator("#dc_username")
	const pauseButton = page.locator("[aria-label=`Pause`]")
	const video = page.locator("#video")
	const dcLoginButton = page.locator("#buttonSubmitForm")

	return { loginViaSidebar, watchVideo, loginViaVideo }

	async function loginViaSidebar(username: string, password: string) {
		const loginButton = page.locator("[data-dc-login=`true`]", {
			hasText: "login",
		})

		await loginButton.click()

		await fillDCLoginFormAndLogin(username, password)
	}

	async function watchVideo() {
		await video.click()

		await pauseButton.waitFor({ state: "attached" })
	}

	async function loginViaVideo(username: string, password: string) {
		await video.click()

		await fillDCLoginFormAndLogin(username, password)
	}

	async function fillDCLoginFormAndLogin(username: string, password: string) {
		await dcUser.fill(username)
		await dcPassword.fill(password)

		await dcLoginButton.click()
	}
}
