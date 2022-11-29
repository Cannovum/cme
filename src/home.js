// Video Popup code

if (
	document.readyState === "complete" ||
	document.readyState === "interactive"
) {
	init()
} else {
	document.addEventListener("DOMContentLoaded", init)
}

function init() {
	const toggles = document.querySelectorAll(".hp-popup-toggle")
	const closeButtons = document.querySelectorAll(".hp-popup-close")
	const backgrounds = document.querySelectorAll(".hp-popup-background")
	function getVideos() {
		return document.querySelectorAll(".hp-popup-video iframe")
	}

	// Adds overflow hidden to the body prevent page scrolling when popup is open
	for (const toggle of toggles) {
		toggle.addEventListener("click", disableScroll)
	}

	for (const element of [...closeButtons, ...backgrounds]) {
		element.addEventListener("click", handleClose(getVideos))
	}
}

function disableScroll() {
	document.body.style.overflow = "hidden"
}

function enableScroll() {
	document.body.style.overflow = "auto"
}

function handleClose(getVideos) {
	return () => {
		enableScroll()
		resetVideoPlayback(getVideos)
	}
}

/**
 *
 * @param {() => HTMLIFrameElement[]} getVideos
 */
function resetVideoPlayback(getVideos) {
	for (const video of getVideos()) {
		// Replace the video to force a reload
		video.replaceWith(video.cloneNode())
	}
}
