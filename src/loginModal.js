export default function createLoginModal() {
	const modalWrapper = document.createElement("div")
	modalWrapper.classList.add(
		"modal_wrapper-" + (Math.random() + 1).toString(36).substring(2)
	)

	const overlay = document.createElement("div")
	overlay.classList.add("modal-overlay")

	const modal = document.createElement("div")
	modal.classList.add("modal")
	const body = document.createElement("div")
	body.classList.add("modal-body")
	body.innerHTML = `<iframe align="left" frameborder="0" scrolling="no" width="467" height="231" name="dc_login_iframe" id="dc_login_iframe" src="https://login.doccheck.com/code/de/2000000016834/login_xl/" ><a href="https://login.doccheck.com/code/de/2000000016834/login_xl/" target="_blank">LOGIN</a></iframe>`

	const closeButton = document.createElement("div")
	closeButton.classList.add("modal-close-button")
	closeButton.dataset.modalCloseButton = true
	closeButton.innerHTML = `<div class="txt_white mr12 text-small">Schließen</div>
  <img src="https://uploads-ssl.webflow.com/60c715a8f0171b333d99d01c/60c715a8f0171b0df599d0c8_ic_round-close%20-white.svg" loading="lazy" alt="" class="w18 h18">`

	modalWrapper.append(modal, overlay)
	modal.append(closeButton, body)

	overlay.addEventListener("click", () => closeModal())
	closeButton.addEventListener("click", () => closeModal())

	// * Return
	return modalWrapper //the modal

	// * Functions
	function closeModal() {
		if (modal == null) {
			console.error("Modal close error")
			console.error(modal)
			return
		}
		// modal.classList.remove("active")
		// overlay.classList.remove("active")
		setTimeout(() => modalWrapper.remove(), 125)
	}
}

function openModal() {
	if (modal == null) {
		console.error("Modal open error")
		console.error(modal)
		return
	}
	modal.classList.add("active")
	overlay.classList.add("active")
}
