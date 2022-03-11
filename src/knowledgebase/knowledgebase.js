import buildGlossar from "./glossar"
import createSearch from "./searchKnowledgebase"
import downloads from "./Downloads"

document.addEventListener("DOMContentLoaded", () => {
	createSearch()
	buildGlossar()
	downloads()
})
