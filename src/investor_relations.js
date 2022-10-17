import anime from "animejs"

// ## Set up the count up elements
const IO = new IntersectionObserver(countUpCallback, { threshold: 1 })

// Get them
const elements = document.querySelectorAll("[data-counter]")

// Observe them and start the callback when they enter the view
elements.forEach((element) => {
	IO.observe(element)
})

/**
 *
 * @param {IntersectionObserverEntry[]} entries
 */
function countUpCallback(entries) {
	entries.forEach((entry) => {
		const element = entry.target

		// @ts-ignore
		const valueToAnimateTo = Number(element?.innerText)

		if (entry.isIntersecting && !element.classList.contains("hasCounted")) {
			// @ts-ignore
			anime({
				targets: element,
				innerText: [0, valueToAnimateTo],
				duration: 2000,
				delay: 16,
				easing: "linear",
				round: true,
			})

			element.classList.add("hasCounted")
		}
	})
}

// ## Set up the copy buttons
const copyButtons = document.querySelectorAll("[data-toCopy]")

copyButtons.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		/**
		 * @type JQuery<HTMLElement>
		 */
		// @ts-ignore - Intellisense does not seem to work here
		const target = $(e.target)
		const toCopyID = target.attr("data-toCopy")
		const text = $(`#${toCopyID}`).text()

		navigator.clipboard
			.writeText(text)
			.then(() => {
				target.fadeOut(120, () => {
					target.attr(
						"src",
						"https://uploads-ssl.webflow.com/604776bdd3e12a68b98cc1ca/60940b4bc3e37d168ae9fcf2_done%20-success.svg"
					)
					target.fadeIn("fast")
				})

				setTimeout(() => {
					target.fadeOut(() => {
						target.attr(
							"src",
							"https://uploads-ssl.webflow.com/60926f7c9d2b2e26dc68b384/6332bfd999f46a0014dd46c9_copy%20grey.svg"
						)
						target.fadeIn("fast")
					})
				}, 1000)
			})
			.catch(() => {
				alert("Error")
			})
	})
})

// # World map

setUpMap()

function setUpMap() {
	// CSS class names
	const markerClass = ".ir__map-dot"
	const countryClass = ".ir__map-location"
	const dotClass = ".ir__map-circle"
	const innerCircleClass = ".ir__map-inner-circle"

	const markers = [...document.querySelectorAll(markerClass)]

	const marketSizeElement = document.querySelector(".ir__map-market-size")

	const infoElement = document.querySelector(".ir__map-more-infos")

	const marketSizeWrapper = document.querySelector(".ir__marketsize__meta")

	const countryTitle = document.querySelector(
		".ir__map__selected-country-title"
	)

	markers.forEach((marker) => {
		// Set them to their inactive default state
		deactivateMarker(marker)

		// Add the click events
		marker.addEventListener("click", handleClick)
		marker.addEventListener("mouseover", handleHoverIn)
		marker.addEventListener("mouseleave", handleHoverOut)
	})

	// Click the one which should be opened by default
	markers
		.find((marker) => marker.getAttribute("data-isdefault") === "true")
		?.click()

	function handleClick({ currentTarget: clickedMarker }) {
		// Activate the clicked marker
		activateMarker(clickedMarker)

		// And deactivate the other markers
		markers
			.filter((marker) => marker !== clickedMarker)
			.forEach(deactivateMarker)
	}

	function handleHoverIn({ currentTarget: hoveredMarker }) {
		const isActive = hoveredMarker.getAttribute("data-isActive") === "true"

		if (isActive) return

		animateMarkerOpen(hoveredMarker)
	}

	function handleHoverOut({ currentTarget: hoveredMarker }) {
		const isActive = hoveredMarker.getAttribute("data-isActive") === "true"
		if (isActive) return

		animateMarkerClose(hoveredMarker)
	}

	/**
	 *
	 * @param {HTMLElement} marker
	 */
	function deactivateMarker(marker) {
		marker.setAttribute("data-isActive", "false")

		animateMarkerClose(marker)
	}

	/**
	 * @param {HTMLElement} marker
	 */
	function activateMarker(marker) {
		const { country, marketSize, moreInfos } = getMarkerAttributes(marker)

		marker.setAttribute("data-isActive", "true")

		setMarketSize(marketSize)
		setInfo(moreInfos)
		setCountry(country)

		animateMarkerOpen(marker)
	}

	/**
	 * @param {HTMLElement} marker
	 */
	function animateMarkerOpen(marker) {
		const { countryElement, innerCircle } = getMarkerElements(marker)

		countryElement.style.pointerEvents = "auto"

		anime.remove(innerCircle)
		anime.remove(countryElement)

		anime
			.timeline()
			.add({
				targets: innerCircle,
				scale: 2,
				duration: 200,
				easing: "easeInOutSine",
			})
			.add({
				targets: countryElement,
				translateX: 0,
				opacity: 1,
				duration: 200,
				easing: "easeInOutSine",
			})
	}

	/**
	 * @param {HTMLElement} marker
	 */
	function animateMarkerClose(marker) {
		const { countryElement, innerCircle } = getMarkerElements(marker)

		countryElement.style.pointerEvents = "none"

		anime.remove(innerCircle)
		anime.remove(countryElement)

		anime({
			targets: countryElement,
			translateX: -20,
			duration: 100,
			opacity: 0,
			easing: "easeInOutSine",
		})

		anime({
			delay: 50,
			targets: innerCircle,
			scale: 1,
			duration: 100,
			easing: "easeInOutSine",
		})
	}

	/**
	 *
	 * @param {string} newSize
	 */
	function setMarketSize(newSize) {
		if (newSize === undefined || newSize === "") {
			marketSizeWrapper.style.display = "none"
		} else {
			marketSizeWrapper.style.display = "flex"
			marketSizeElement.innerText = newSize
		}
	}

	/**
	 *
	 * @param {string} info
	 */
	function setInfo(info) {
		infoElement.innerText = info
	}

	/**
	 * @param {string} country
	 */
	function setCountry(country) {
		countryTitle.innerText = country
	}

	/**
	 * @typedef {Object} MarkerInnerElements
	 * @property {HTMLElement} countryElement
	 * @property {HTMLElement} innerCircle
	 * @property {HTMLElement} dot
	 */

	/**
	 * @param {HTMLElement} marker
	 * @return {MarkerInnerElements}
	 */
	function getMarkerElements(marker) {
		const countryElement = marker.querySelector(countryClass)
		const innerCircle = marker.querySelector(innerCircleClass)
		const dot = marker.querySelector(dotClass)

		// @ts-ignore
		return { countryElement, innerCircle, dot }
	}

	/**
	 *
	 * @param {HTMLElement} marker
	 */
	function getMarkerAttributes(marker) {
		/**
		 * @type string
		 */
		const marketSize = marker.getAttribute("data-marketsize")

		/**
		 * @type string
		 */
		const moreInfos = marker.getAttribute("data-moreinfos")

		/**
		 * @type string
		 */
		const country = marker.querySelector(countryClass).innerText

		return { marketSize, moreInfos, country }
	}
}
