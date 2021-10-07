import buildGlossar from "./glossar"
import createSearch from "./searchKnowledgebase"

document.addEventListener("DOMContentLoaded", () => {
	createSearch()
	buildGlossar()
})
