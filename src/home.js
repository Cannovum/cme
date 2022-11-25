// Video Popup code

if (
	document.readyState === "complete" ||
	document.readyState === "interactive"
) {
	init()
} else {
	document.addEventListener("DOMContentLoaded", init)
}

async function init() {
	const toggle = document.querySelector(".hp-popup-toggle")
	const closeButton = document.querySelector(".hp-popup-close")
	const background = document.querySelector(".hp-popup-background")
	const video = document.querySelector("#interview_video iframe")

	console.log("TEST")

	console.log({ toggle, closeButton, background })

	// Adds overflow hidden to the body prevent page scrolling when popup is open
	toggle.addEventListener("click", disableScroll)

	for (const element of [closeButton, background]) {
		element.addEventListener("click", handleClose(video))
	}
}

function disableScroll() {
	document.body.style.overflow = "hidden"
}

function enableScroll() {
	document.body.style.overflow = "auto"
}

function handleClose(videoIFrame) {
	console.log({ videoIFrame })
	console.log(videoIFrame.attr("src"))

	return () => {
		enableScroll()
		resetVideoPlayback(videoIFrame)
	}
}

// Maybe do it with a timeout
function resetVideoPlayback(videoIFrame) {
	console.log({ videoIFrameX: videoIFrame })
	const currentSource = videoIFrame.attr("src")

	setTimeout(() => {
		// Override with empty src and set it again to force a reload
		videoIFrame.attr("src", currentSource)
	})
}
