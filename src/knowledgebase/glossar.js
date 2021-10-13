import { entries } from "lodash"

export default async function buildGlossar() {
	const wrapper = document.querySelector(".collection-list-9")
	const entries = Array.from(document.querySelectorAll(".collection-item-6"))
	const letterContainer = document
		.querySelector(".div-block-140")
		.cloneNode(true)

	const glossar = formatEntries(entries)
	Array.from(entries).forEach((e) => e.remove())
	createGlossarEntries(glossar)
	createGlossarLinks(glossar)

	function formatEntries(entries) {
		const glossar = entries
			.map((e) => {
				const name = e.querySelector("h3").innerText
				e.querySelector(".div-block-140").remove()
				const result = e.cloneNode(true)
				result.titel = name
				result.letter = name[0].toUpperCase()

				// Add the show more functionallity
				const textWrapper = result.querySelector(".glossar-text-wrapper")
				createShowMore(textWrapper)

				return result
			})
			.reduce((acc, e) => {
				acc[e.letter] = acc[e.letter] ? [...acc[e.letter], e] : [e]
				return acc
			}, {})
		// => {A: Array(4), B: Array(1), C: Array(0), D: Array(1)}
		return glossar
	}

	function createGlossarEntries(glossar) {
		Object.entries(glossar).forEach(([letter, entry]) => {
			entry.forEach((e) => {
				wrapper.append(e)
				// Set the letter
				if (e.previousElementSibling?.letter != letter) {
					const letterBox = letterContainer.cloneNode(true)
					letterBox.querySelector(".letter").innerText = letter
					letterBox.id = letter
					e.querySelector(".placeholder-div").append(letterBox)
				}
			})
		})
	}

	function createGlossarLinks(glossar) {
		const container = document.querySelector(".div-block-139")
		container.replaceChildren()
		// prettier-ignore
		const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

		const glossarLetters = Object.keys(glossar)
		alphabet.forEach((letter) => {
			const letterLink = document.createElement("a")
			letterLink.innerText = letter
			letterLink.classList.add("glossar-alphabet-link")
			if (glossarLetters.includes(letter)) {
				const id = "#" + letter
				letterLink.href = id
				letterLink.addEventListener("click", (e) => {
					e.preventDefault()
					document.querySelector(id).scrollIntoView({ behavior: "smooth" })
				})
			} else {
				letterLink.classList.add("disable")
			}
			container.append(letterLink)
		})
	}
}

function createShowMore(element) {
	const icon = element.querySelector(".glossar-text-hider_icon")
	const textContent = element.querySelector(".glossar-text-content")
	const hider = element.querySelector(".glossar-text-hider")

	icon.addEventListener("click", (e) => {
		if (element.clicked !== 1) {
			showText()
		} else {
			hideText()
		}
	})

	hider.addEventListener("click", (e) => {
		console.log("x", element.clicked)
		if (element.clicked !== 1) showText(e)
	})

	function showText() {
		textContent.style.height = "auto"
		hider.classList.add("inactive")
		icon.classList.add("rotated")

		element.clicked = 1
		console.log(element.clicked)
		console.log("show")
	}

	function hideText() {
		textContent.style.height = "168px"
		hider.classList.remove("inactive")
		icon.classList.remove("rotated")

		element.clicked = 0
		console.log(element.clicked)
		console.log("hide")
	}
}
