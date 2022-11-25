import "./login.css"

import createLoginModal from "./loginModal"

const sessionStorageRedirectKey = "login-redirect" // the key to set and retrieve from the session storage

MemberStack.onReady.then(({ loggedIn }) => {
	if (
		document.readyState === "interactive" ||
		document.readyState === "complete"
	) {
		initialise(loggedIn)
	} else {
		window.addEventListener("DOMContentLoaded", initialise(loggedIn))
	}
})

function initialise(loggedIn) {
	setupAuthButtons(loggedIn)
	if (loggedIn) {
		redirectUser(sessionStorageRedirectKey) // Redirect user if he should be redirected after the login
		setupLoggedInSite()
	} else {
		setupLoggedOutSite(sessionStorageRedirectKey)
	}
}

// #################################################################
//? Functions ######################################################
// #################################################################

async function setupLoggedInSite() {
	addNavLogoutButton() // Has to be executed before adding the listeners

	const logoutButtons = getAuthButtons("logout")

	for (const logoutButton of logoutButtons) {
		logoutButton.addEventListener("click", handleLogoutClick())
	}
}

async function setupLoggedOutSite(sessionStorageRedirectKey) {
	addHrefToLoginButton()

	removeProtectedElements()

	const loginButtons = getAuthButtons("login")

	for (const loginButton of loginButtons) {
		loginButton.addEventListener(
			"click",
			handleLoginClick(sessionStorageRedirectKey)
		)
	}
}

async function handleLogoutClick(event) {
	event.preventDefault()
	MemberStack.logout()
}

function handleLoginClick(sessionStorageRedirectKey) {
	return async (event) => {
		event.preventDefault()

		let redirectLink =
			event.target.getAttribute("data-login-redirect") ||
			event.target.parentNode.getAttribute("data-login-redirect")

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

function getAuthButtons(type) {
	if (type !== "login" && type !== "logout")
		console.error("Invalid argument error:", type)
	const query = type === "login" ? "[data-dc-login]" : "[data-dc-logout]"

	return document.querySelectorAll(query)
}

function redirectUser(redirectKey) {
	const loginRedirect = sessionStorage.getItem(redirectKey)

	if (!loginRedirect || loginRedirect === null) {
		console.log("No redirect link")
		return
	}

	sessionStorage.removeItem(sessionStorageRedirectKey)
	window.location.assign(loginRedirect) // Redirect user
}

async function setupAuthButtons(loggedIn) {
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
		) {
			return
		}

		loginButton.setAttribute(
			"href",
			loginButton.getAttribute("data-login-redirect") ?? window.location.href
		) // Set redirect link for the login process. Redirect to the same page if data is not set on the element
	}
}

async function removeProtectedElements() {
	const elements = document.querySelectorAll("[data-dc-protected]")
	for (const element of elements) {
		element.remove()
	}
}

async function addNavLogoutButton() {
	// Get navbars
	const navbar = document.querySelector(".navigation-container")
	const navbarMobile = document.querySelector(".navigation-container-mob")

	// Create logoutButton
	const logoutButtonWrapper = document.createElement("button")
	logoutButtonWrapper.classList.add("navbar-logout_button", "text_primary")

	const logoutText = document.createElement("div")
	logoutText.innerText = "Logout"

	const logoutButton = document.createElement("img")
	logoutButton.src =
		"https://uploads-ssl.webflow.com/60926f7c9d2b2e26dc68b384/62e79ecdbd9b8038429584fe_log-out-2.svg"

	logoutButtonWrapper.append(logoutText, logoutButton)
	logoutButtonWrapper.addEventListener("click", handleLogoutClick)

	// Append logoutButton to navigation bar
	const logoutButtons = [
		logoutButtonWrapper,
		logoutButtonWrapper.cloneNode(true),
	]

	navbar.append(logoutButtons[0])
	navbarMobile.append(logoutButtons[1])

	document.addEventListener("scroll", async () => {
		if (window.scrollY >= 140) {
			for (const button of logoutButtons) {
				button.classList.add("hideLogoutButton")
			}
		} else {
			for (const button of logoutButtons) {
				button.classList.remove("hideLogoutButton")
			}
		}
	})
}
