import createLoginModale from "./loginModal"
import { loggedIn } from "./helpers.js"

console.log("Logged in: ", loggedIn())

MemberStack.onReady.then((member) => {
	// * MS stuff
	if (member.loggedIn) {
		localStorage.setItem("loggedIn", "true")

		let redirect = sessionStorage.getItem("redirect")
		if (redirect) {
			console.log("redirect user")
			$(".dc_login-btn").hide()
			sessionStorage.removeItem("redirect")
			window.location.assign(redirect) // Redirect user
		}
	} else {
		localStorage.setItem("loggedIn", "")
		$(".log_in_btn").click(() => {
			sessionStorage.setItem("redirect", window.location.href)
			document.body.append(createLoginModale())
		})
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
