/*
Only for the text env to get rid of DocCheck
*/

document.addEventListener("DOMContentLoaded", async () => {
	const loginLink = document.createElement("a")
	loginLink.innerText = "Login"
	loginLink.href = "/member/login-weiterleitung"
	loginLink.style.width = "400px"
	loginLink.style.padding = "16px"
	loginLink.style.borderRadius = "24px"
	loginLink.style.display = "block"
	loginLink.style.backgroundColor = "white"

	const observer = new MutationObserver((mutationList, obersver) => {
		mutationList.forEach((mutation) => {
			if (
				mutation.type === "childList" &&
				document.querySelector("#dc_login_iframe")
			) {
				document
					.querySelector("#dc_login_iframe")
					.parentNode.replaceChildren(loginLink)

				console.log("Observer replaced docCheck")
			}
		})
	})
	observer.observe(document.body, { childList: true, subtree: true })
	console.log("Observer loaded. Test enviroment active - DocCheck disabled")
})
