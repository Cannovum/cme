import counterUp from "counterup2"

// ## Set up the count up elements

const IO = new IntersectionObserver(countUpCallback, { threshold: 1 })

// Get them
const elements = document.querySelectorAll("[data-counter]")

// Observe them and start the callback when they enter the view
elements.forEach((element) => {
	IO.observe(element)
})

function countUpCallback(entries) {
	entries.forEach((entry) => {
		const element = entry.target

		if (entry.isIntersecting && !element.classList.contains("hasCounted")) {
			counterUp(element, {
				duration: 2000,
				delay: 16,
			})

			element.classList.add("hasCounted")
		}
	})
}

// ## Set up the copy buttons
const copyButtons = document.querySelectorAll("[data-toCopy]")

copyButtons.forEach((btn) => {
	btn.addEventListener("click", (e) => {
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
