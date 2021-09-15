import createLoginModale from "./loginModal"
import { loggedIn } from "./helpers.js"

MemberStack.onReady.then((member) => {
	// * MS stuff
	if (member.loggedIn) {
		// Redirect
		let redirect = sessionStorage.getItem("redirect")
		if (redirect) {
			console.log("redirect user")
			$(".dc_login-btn").hide()
			sessionStorage.removeItem("redirect")
			window.location.assign(redirect) // Redirect user
		}

		// Hide login button
		$("[data-dc-login]").hide()
	} else {
		$("[data-dc-logout]").hide()
	}
})

// ? Global click listener for login / logout buttons
document.body.addEventListener("click", (e) => {
	if (
		e.target.matches("[data-dc-login]") ||
		e.target.parentNode.matches("[data-dc-login]")
	) {
		sessionStorage.setItem("redirect", window.location.href)
		e.preventDefault()
		document.body.append(createLoginModale())
	} else if (
		e.target.matches("[data-dc-logout]") ||
		e.target.parentNode.matches("[data-dc-logout]")
	) {
		MemberStack.logout()
	}
})
