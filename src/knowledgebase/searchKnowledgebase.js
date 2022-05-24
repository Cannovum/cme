export default async function createSearch() {
	const resultWrapper = document.querySelector("#search-results")
	const inputBox = document.querySelector("#wissen-search-input")
	const elements = Array.from(document.querySelectorAll("[data-search-item]"))

	resultWrapper.style.transition = "all 200ms ease" // Animate closing
	let searchableData = []
	inputBox.value = ""
	inputBox.addEventListener("input", (e) => {
		const searchTerm = e.target.value.trim().toLowerCase()
		if (searchTerm.length === 0) {
			activateTabs()
			closeSearch(resultWrapper, inputBox)
		} else {
			deactivateTabs()
			resultWrapper.replaceChildren()
			resultWrapper.style.opacity = "100%"
			searchableData = getSearchableData(elements, searchableData)
			const matchedData = filterData(searchableData, searchTerm)
			matchedData.length > 0
				? matchedData.reverse().forEach(({ primary, secondary, type, id }) => {
						const result = createSearchResult(
							type,
							id,
							resultWrapper,
							inputBox,
							primary,
							secondary
						)
						resultWrapper.append(result)
				  })
				: resultWrapper.append("Keine Ergebnisse gefunden")
		}

		document.addEventListener("click", (e) => {
			// Close search if user clicked on a link
			if (e.target.matches("a")) {
				closeSearch(resultWrapper, inputBox)
			}
		})
	})

	addIDtoElemets(elements)
}

function createSearchResult(
	type,
	id,
	resultWrapper,
	inputBox,
	primary,
	secondary
) {
	const result = document.createElement("div")
	result.classList.add("know-search-result-wrapper")

	const typeTag = document.createElement("div")
	typeTag.classList.add("text-smaller", "grey")
	typeTag.innerText = type

	const titelContainer = document.createElement("div")
	titelContainer.classList.add("flex")
	const link = document.createElement("a")
	link.href = "#" + id
	link.classList.add("h4", "black", "hover-primary")

	// Handle Onclick
	link.addEventListener("click", (e) => {
		e.preventDefault()
		switchTab(type)
		closeSearch(resultWrapper, inputBox)
		document.querySelector("#" + id).scrollIntoView({ behavior: "smooth" })
	})

	link.innerText = primary
	const icon = document.createElement("img")
	icon.src =
		"https://uploads-ssl.webflow.com/60926f7c9d2b2e26dc68b384/60926f7c9d2b2ee3ce68b3b6_chevron-right.svg"

	const content = document.createElement("div")
	content.classList.add("grey")
	content.innerHTML = secondary

	titelContainer.append(link, icon)
	result.append(typeTag, titelContainer, content)
	return result
}

// * Functions * //

function getSearchableData(elements, searchData) {
	if (searchData.length > 0) return searchData

	const data = elements.map((item) => {
		const primary = item.querySelector("[data-search-primary]").innerText
		const secondary = cleanUpText(
			item.querySelector("[data-search-secondary]").innerText
		)
		const type = item.getAttribute("data-search-item")
		const id = item.id

		return { primary, secondary, type, id }
	})
	return data
}

function filterData(searchData, searchTerm) {
	const result = []

	searchData.forEach(({ primary, secondary, type, id }) => {
		if (primary.toLowerCase().includes(searchTerm)) {
			const match = createMatchObject(primary, secondary, type, id, 1) // Search Score 1
			result.push(match)
		} else if (secondary.toLowerCase().includes(searchTerm)) {
			const match = createMatchObject(primary, secondary, type, id, 0) // Search Score 0
			result.push(match)
		}
	})
	result.sort((a, b) => {
		let varA = a.searchScore
		let varB = b.searchScore
		if (varA < varB) {
			return -1
		}
		if (varA > varB) {
			return 1
		}
		return 0
	})

	return result

	function createMatchObject(primary, secondary, type, id, score) {
		return {
			primary: primary.trim(),
			secondary: trunctateMatch(searchTerm, secondary.trim()),
			type,
			searchScore: score,
			id,
		}
	}
}

function addIDtoElemets(elements) {
	elements.map((e, i) => {
		if (!e.id) e.id = "wissen-" + i
		return e
	})
}

function closeSearch(resultsElement, searchBox) {
	searchBox.value = ""
	resultsElement.style.transition = "all 200ms ease"
	resultsElement.style.opacity = "0%"
	setTimeout(() => resultsElement.replaceChildren(), 2200)
}

function switchTab(tab) {
	tab = tab.toLowerCase()

	let tabID
	switch (tab) {
		case "faq":
			tabID = "#w-tabs-0-data-w-tab-0"
			break

		case "literatur":
			tabID = "#w-tabs-0-data-w-tab-1"
			break

		case "glossar":
			tabID = "#w-tabs-0-data-w-tab-2"
			break

		case "download":
			tabID = "#w-tabs-0-data-w-tab-3"
			break

		default:
			throw Error("No tab matched")
	}
	// * Set active tab
	const newActiveTab = document.querySelector(tabID)
	newActiveTab.classList.add("w--current")
	newActiveTab.setAttribute("aria-selected", "true")

	// Show tab content
	document
		.querySelector("#" + newActiveTab.getAttribute("aria-controls"))
		.classList.add("w--tab-active")
	// Deactivate others
	Array.from(document.querySelectorAll(`[role="tab"]:not(${tabID})`)).forEach(
		(e) => {
			e.classList.remove("w--current")
			e.setAttribute("aria-selected", "false")
			// Hide tab content
			document
				.querySelector("#" + e.getAttribute("aria-controls"))
				.classList.remove("w--tab-active")
		}
	)
}
function deactivateTabs() {
	Array.from(document.querySelectorAll(`[role="tab"]`)).forEach((e) => {
		e.classList.remove("w--current")
		e.setAttribute("aria-selected", "false")
		// Hide tab content
		document
			.querySelector("#" + e.getAttribute("aria-controls"))
			.classList.remove("w--tab-active")
	})
}

function activateTabs() {
	const tab = document.querySelector(`.tabs-menu [role="tab"]`)
	tab.classList.add("w--current")
	tab.setAttribute("aria-selected", "true")

	// Hide tab content
	const tabContent = document.querySelector(
		"#" + tab.getAttribute("aria-controls")
	)
	tabContent.classList.add("w--tab-active")
}

function trunctateMatch(searchTerm, text) {
	searchTerm = searchTerm.toLowerCase()

	const padding = 85
	const indexMatch = text.toLowerCase().indexOf(searchTerm)

	if (indexMatch === -1) searchTerm = text[0].toLocaleLowerCase() // Content text does not match searchTerm. Instead use first letter of text

	const extraPaddingRight =
		indexMatch - padding < 0 ? Math.abs(indexMatch - padding) : 0
	const paddingLeftCalcExtra =
		text.length - (indexMatch + searchTerm.length + padding)
	const extraPaddingLeft =
		paddingLeftCalcExtra < 0 ? Math.abs(paddingLeftCalcExtra) : 0

	const spaceLeft =
		indexMatch - padding >= 0
			? indexMatch -
			  padding -
			  extraPaddingLeft +
			  text.slice(indexMatch - padding - extraPaddingLeft).indexOf(" ")
			: 0
	const spaceRightBase =
		indexMatch + searchTerm.length + padding + extraPaddingRight
	const spaceRight =
		indexMatch +
		searchTerm.length +
		padding +
		extraPaddingRight +
		(text.slice(spaceRightBase).indexOf(" ") !== -1
			? text.slice(spaceRightBase).indexOf(" ")
			: text.slice(spaceRightBase).indexOf(".")) +
		1

	const modifiedText =
		(indexMatch - spaceLeft < 0 ? "" : "&hellip; ") +
		text.slice(spaceLeft, spaceRight) +
		(indexMatch + spaceRight < text.length ? " &hellip;" : "")
	const modifiedIndex = modifiedText.toLowerCase().indexOf(searchTerm)

	const result =
		indexMatch !== -1
			? modifiedText.slice(0, modifiedIndex) +
			  "<span style='color: #fd9e4b'>" +
			  modifiedText.slice(modifiedIndex, modifiedIndex + searchTerm.length) +
			  "</span>" +
			  modifiedText.slice(modifiedIndex + searchTerm.length)
			: modifiedText

	return result
}

function cleanUpText(text) {
	// Clean text a bit
	while (text.includes("\n ")) {
		text = text.replace("\n ", "\n")
	}
	while (text.includes("\n\n")) {
		text = text.replace("\n\n", "\n")
	}
	while (text.includes("  ")) {
		text = text.replace("  ", " ")
	}
	return text
}
