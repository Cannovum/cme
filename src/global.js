MemberStack.onReady.then((member) => {
	// * MS stuff
	if (member.loggedIn) {
		let redirect = sessionStorage.getItem("redirect")
		if (redirect) {
			$(".dc_login-btn").hide()
			sessionStorage.removeItem("redirect")
			router(redirect)
		}
	} else {
		$(".log_in_btn").click(() => {
			sessionStorage.setItem("redirect", window.location.href)
			openLoginModal()
		})
	}
})

document.body.addEventListener("click", () => {})

const loggedIn = () =>
	JSON.parse(localStorage.getItem("memberstack")).protected[0].access
