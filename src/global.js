import createLoginModal from "./loginModal"

MemberStack.onReady.then(({ loggedIn }) => {
	//  MS stuff

	const sessionStorageRedirectKey = "login-redirect"

	redirectUser(sessionStorageRedirectKey)
	setAuthButtons()
	if (!loggedIn) {
		addHrefToLoginButton()
		removeProtectedElements()
	}

	// ? Global click listener for login / logout buttons
	document.body.addEventListener("click", (e) => {
		if (loggedIn) checkLogoutClick(e)
		else checkLoginClick(e)

		function checkLoginClick(e) {
			if (
				e.target.matches("[data-dc-login]") ||
				e.target.matches("#fachkreis-login") ||
				e.target.parentNode.matches("[data-dc-login]") ||
				e.target.parentNode.matches("#fachkreis-login")
			) {
				e.preventDefault()
				// console.log("Matched login link")

				let redirectLink =
					e.target.getAttribute("data-login-redirect") ||
					e.target.parentNode.getAttribute("data-login-redirect")
				if (redirectLink) {
					switch (redirectLink) {
						case "stay":
							redirectLink = window.location.href
							break

						case "home":
							redirectLink = window.location.origin
							break
					}

					sessionStorage.setItem(sessionStorageRedirectKey, redirectLink)
				}
				document.body.append(createLoginModal(sessionStorageRedirectKey))
			}
		}

		function checkLogoutClick(e) {
			if (
				e.target.matches("[data-dc-logout]") ||
				e.target.parentNode.matches("[data-dc-logout]") ||
				e.target.matches("#dc-logout") ||
				e.target.parentNode.matches("#dc-logout")
			) {
				e.preventDefault()
				// console.log("Matched login logout link")
				MemberStack.logout()
			}
		}
	})

	function redirectUser(redirectKey) {
		const loginRedirect = sessionStorage.getItem(redirectKey)
		if (!loginRedirect) return

		if (loginRedirect === null) {
			console.log("No redirect link")
			return
		}
		if (!loggedIn) {
			// console.log("Redirect started but user is not logged in")
			return
		}

		// console.log("redirect user to: " + loginRedirect)
		sessionStorage.removeItem(sessionStorageRedirectKey)
		window.location.assign(loginRedirect) // Redirect user
	}

	async function setAuthButtons() {
		if (loggedIn) {
			const loginButtons = getAuthButtons("login")
			for (const loginButton of loginButtons) {
				loginButton.remove()
			}
		} else {
			const logoutButtons = getAuthButtons("logout")
			for (const logoutButton of logoutButtons) {
				logoutButton.remove()
			}
		}
	}

	async function addHrefToLoginButton() {
		const loginButtons = getAuthButtons("login")
		for (const loginButton of loginButtons) {
			if (
				!loginButton?.hasAttribute("href") &&
				loginButton?.getAttribute("href") !== "#"
			)
				return

			loginButton.setAttribute(
				"href",
				loginButton.getAttribute("data-login-redirect") ?? window.location.href
			) // Set redirect link for the login process. Redirect to the same page if data is not set on the elemnt
		}
	}

	async function removeProtectedElements() {
		const elements = document.querySelectorAll("[data-dc-protected]")
		for (const ele of elements) {
			ele.remove()
		}
	}
})

function getAuthButtons(type) {
	if (type !== "login" && type !== "logout")
		console.error("Invalid argument error:", type)
	const query = type === "login" ? "[data-dc-login]" : "[data-dc-logout]"

	return document.querySelectorAll(query)
}
