import createLoginModal from "./loginModal"

MemberStack.onReady.then((member) => {
	//  MS stuff

	const loginButton = $("#nav-dc-login-btn")
	const logoutButton = $("#dc-logout")
	const sessionStorageRedirectKey = "redirect"

	redirectUser(sessionStorageRedirectKey)
	hideAuthButton()
	addHrefToLoginButton()

	// ? Global click listener for login / logout buttons
	document.body.addEventListener("click", (e) => {
		checkLoginClick(e)
		checkLogoutClick()

		function checkLoginClick(e) {
			console.log("Clicked registered")
			if (
				e.target.matches("[data-dc-login]") ||
				e.target.matches("#fachkreis-login") ||
				e.target.parentNode.matches("[data-dc-login]") ||
				e.target.parentNode.matches("#fachkreis-login")
			) {
				e.preventDefault()
				console.log("Matched login link")

				let redirectLink =
					e.target.getAttribute("data-login-redirect") ||
					e.target.parentNode.getAttribute("data-login-redirect")
				console.log("redirect link: " + redirectLink)
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

		function checkLogoutClick() {
			if (
				!e.target.matches("[data-dc-logout]") ||
				!e.target.parentNode.matches("[data-dc-logout]")
			) {
				return
			}
			console.log("Matched login logout link")
			MemberStack.logout()
		}
	})

	function redirectUser(redirectKey) {
		const loginRedirect = sessionStorage.getItem(redirectKey)
		if (loginRedirect === null) {
			console.log(redirectKey)
			console.log(sessionStorage.getItem(loginRedirect))
			console.log("No redirect link")
			return
		}
		if (!member.loggedIn) {
			console.log("Redirect started but user is not logged in")
			sessionStorage.removeItem(sessionStorageRedirectKey)
			return
		}

		console.log("redirect user to: " + loginRedirect)
		sessionStorage.removeItem(sessionStorageRedirectKey)
		window.location.assign(loginRedirect) // Redirect user
	}

	function hideAuthButton() {
		if (member.loggedIn && loginButton) loginButton?.hide()
		else logoutButton?.hide()
	}

	function addHrefToLoginButton() {
		if (!loginButton.attr("href")) return
		loginButton.attr("href", loginButton.attr("data-login-redirect"))
	}
})
