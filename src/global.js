import createLoginModal from "./loginModal"

MemberStack.onReady.then((member) => {
	//  MS stuff
	redirectUser()
	hideAuthButton()

	const loginButton = $("#nav-dc-login-btn")
	const logoutButton = $("#dc-logout")
	const sessionRedirect = "login-redirect"

	addHrefToLoginButton()

	// ? Global click listener for login / logout buttons
	document.body.addEventListener("click", (e) => {
		checkLoginClick()
		checkLogoutClick()

		function checkLoginClick() {
			if (
				!e.target.matches("[data-dc-login]") ||
				!e.target.parentNode.matches("[data-dc-login]")
			) {
				return
			}

			let redirectLink = e.target.getAttribute("data-login-redirect")
			if (redirectLink) {
				switch (redirectLink) {
					case "stay":
						redirectLink = window.location.href
						break

					case "home":
						redirectLink = window.location.origin
						break
				}

				sessionStorage.setItem(sessionRedirect, redirectLink)
			}

			document.body.append(createLoginModal(sessionRedirect))
		}

		function checkLogoutClick() {
			if (
				!e.target.matches("[data-dc-logout]") ||
				!e.target.parentNode.matches("[data-dc-logout]")
			) {
				return
			}
			MemberStack.logout()
		}
	})

	function redirectUser() {
		if (!member.loggedIn) return
		const loginRedirect = sessionStorage.getItem(sessionRedirect)
		if (loginRedirect && loginRedirect !== "dont") {
			console.log("redirect user")
			sessionStorage.removeItem(sessionRedirect)
			window.location.assign(loginRedirect) // Redirect user
		}
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
