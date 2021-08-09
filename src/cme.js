//https://mocki.io/v1/3172ef8d-e1b7-4769-b4a0-f22918057fb1
//https://enpegcr0bq40jrt.m.pipedream.net
//--------------------------------------------------------
import LZUTF8 from "lzutf8"
import Papa from "papaparse"
import Player from "@vimeo/player"
import createVideoView from "./videoView.js"
import createCurriculum from "./curriculumComponent.js"
import createSidebar from "./sidebar.js"

const curriculumWrapper = document.querySelector(".curriulum_c_wrapper")
const viewWrapper = document.querySelector("#spa-view-toggle")
const viewContainer = document.querySelector("#spa-view")
const sidebar = document.querySelector(".sticky_meta_lecture")
const course = document
	.querySelector("#course_data")
	.getAttribute("data-course") // Erhalte KursID, geprintet von Webflow (Metadatei im CMS)

window.addEventListener("popstate", (e) => {
	// * Automatic Routing
	router(window.location.href)
})

document.addEventListener("DOMContentLoaded", async () => {
	// *** Gets executed after the page loaded *** //

	// * Route to the correct view by using current link
	// (example: view="video" is set and it takes you to the video view)
	router(window.location.href)

	// * Create curriculum
	const data = await getCoursesData(course)
	curriculumWrapper.appendChild(await createCurriculum(data))

	// * Construct overview video in overview tab
	const playerURL = document
		.querySelector("#overview_video")
		.getAttribute("data-vimeo-url")
	const playerDiv = document.querySelector("#overview_video")
	const overviewPlayer = new Player(playerDiv, {
		byline: false,
		title: false,
		width: "687px",
		url: playerURL,
	})

	// * Add eventlistener to the tabs
	const tabs = document.querySelectorAll("[data-spa_tab]")
	tabs.forEach((tab) => {
		tab.addEventListener("click", () => {
			// Force activate tab
			tab.classList.add("w--current")
			// Select tab content and activate it
			const dataAttr = `[data-w-tab='${tab.getAttribute("data-w-tab")}']`
			document
				.querySelector(`.tabs-content.w-tab-content ${dataAttr}`)
				.classList.add("w--tab-active")

			// Pause player in overview tab
			overviewPlayer.pause()

			// Route to overview (using default value)
			const searchParams = new URLSearchParams(window.location.search)
			if (searchParams.get("view") && searchParams.get("view") != "overview") {
				navigateTo()
			} else {
				router()
			}
		})
	})

	// * SPA Links
	document.body.addEventListener("click", (e) => {
		// Navigate within the SPA, override link custom behaviour
		if (e.target.getAttribute("data-spa-link")) {
			e.preventDefault()
			navigateTo(e.target.href)
		}
	})
})

async function navigateTo(
	url = window.location.protocol +
		"//" +
		window.location.host +
		window.location.pathname,
	replace = false,
	stateData = null
) {
	console.log("navigated")
	history.pushState(null, null, url)
	router(url)
}

async function router(
	url = window.location.protocol +
		"//" +
		window.location.host +
		window.location.pathname
) {
	console.log("routed")
	const queries = new URL(url).searchParams
	const data = await getCoursesData(course)

	const routes = [
		{
			name: "overview",
			view: async () => {
				resetVideoView()
				resetSidebar(data)
			},
		},
		{
			name: "watch",
			view: async () => {
				routeVideo(data, queries)
			},
		},
		{
			name: "notFound",
			view: async () => {
				console.log("not found")
				resetVideoView()
				resetSidebar(data)
			},
		},
	]
	const queryView = queries.get("view")
	const match = queryView
		? // If "view" is set, find matching view
		  routes.find((route) => {
				return queryView === route.name
		  }) || routes.find((route) => route.name === "notFound") // if not found, use notFound
		: routes[0] // routes.find((route) => route.view === "overview") // else use overview view

	match.view() // Run view function
}

async function getCoursesData(course, lesson = null) {
	lesson = lesson ? lesson - 1 : null // Lesson starts with 1, but the index with 0, so x = x -1
	const localData = localStorage.getItem(course)
	if (localData) {
		fetchData(course, lesson)
		return lesson != null
			? JSON.parse(localData)[lesson]
			: JSON.parse(localData)
	} else {
		return await fetchData(course, lesson)
	}

	async function fetchData(course, lesson) {
		const result = await fetch(
			"https://mocki.io/v1/3172ef8d-e1b7-4769-b4a0-f22918057fb1",
			{
				// method: "POST",
				// body: JSON.stringify({ //?Re-enable later
				//   course: "kurs_1",
				// }),
			}
		)
			.then((res) => res.json())
			.then((json) => {
				const decompressedCSV = LZUTF8.decompress(json.data.toString(), {
					inputEncoding: "StorageBinaryString",
				})
				const parsed = Papa.parse(decompressedCSV, {
					header: true,
					dynamicTyping: true,
				})
				localStorage.setItem(course, JSON.stringify(parsed.data))
				return parsed.data
			})
		return result
	}
}

async function resetVideoView() {
	// Hide the wrapper for other views and unloads its contents
	viewWrapper.classList.add("hide")
	viewContainer.replaceChildren()
}

async function routeVideo(data, queries) {
	resetVideoView()
	resetSidebar(data)

	// * Modify tabs unless they are already modified
	const activeTab = document.querySelector("#spa_main_content .w--tab-active")
	if (activeTab) activeTab.classList.remove("w--tab-active")
	const activeTabContent = document.querySelector(
		"#spa_main_content .w--current"
	)
	if (activeTabContent) activeTabContent.classList.remove("w--current")

	// * Load video view
	viewContainer.replaceChildren(
		await createVideoView(data[Number(queries.get("lesson")) - 1])
	)
	viewWrapper.classList.remove("hide")
}

async function resetSidebar(data) {
	sidebar.replaceChildren(createSidebar(data))
}
