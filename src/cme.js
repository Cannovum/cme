//https://mocki.io/v1/3172ef8d-e1b7-4769-b4a0-f22918057fb1
//https://enpegcr0bq40jrt.m.pipedream.net
//------------------------------------------- -------------
import { decompress } from "lzutf8"
import { parse } from "papaparse"
import axios from "axios"
import Player from "@vimeo/player"
import createVideoView from "./videoView.js"
import createCurriculum from "./curriculumComponent.js"
import createSidebar from "./sidebar.js"

const curriculumWrapper = document.querySelector(".curriulum_c_wrapper")
const viewWrapper = document.querySelector("#spa-view-toggle")
const viewContainer = document.querySelector("#spa-view")
const sidebar = document.querySelector(".sticky_meta_lecture")
const curriulumStartpage = document.querySelector("#curriculum_2")
const courseID =
	document.querySelector("#course_data").getAttribute("data-course") || // Erhalte KursID, geprintet von Webflow (Metadatei im CMS)
	console.error("Course ID was not found in document")

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
	const data = await getCoursesData(courseID)
	const curri = await createCurriculum(data)
	curriculumWrapper.appendChild(await createCurriculum(data))
	// Create curriculum at the startpage
	curriulumStartpage.replaceChildren(await createCurriculum(data))

	// * Construct overview video in overview tab
	const playerURL = document
		.querySelector("#overview_video")
		.getAttribute("data-vimeo-url")
	const playerDiv = document.querySelector("#overview_video")
	const overviewPlayer = new Player(playerDiv, {
		byline: false,
		title: false,
		width: 687,
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
	// Navigate within the SPA, override link custom behaviour
	document.body.addEventListener("click", (e) => {
		if (e.target.getAttribute("data-spa-link")) {
			e.preventDefault()
			navigateTo(e.target.href)
		}
	})
})

async function navigateTo(
	url = window.location.origin + window.location.pathname,
	replace = false,
	stateData = null
) {
	history.pushState(null, null, url)
	router(url)
}

async function router(url = window.location.origin + window.location.pathname) {
	const queries = new URL(url).searchParams
	const data = await getCoursesData(courseID)

	const routes = [
		{
			name: "overview",
			view: async () => {
				routeDefault(data)
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
				routeDefault(data)
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

async function getCoursesData(courseID, lesson = null) {
	lesson = lesson ? lesson - 1 : null // Lesson starts with 1, but the index with 0, so x = x -1
	const localData = localStorage.getItem(courseID)
	if (localData) {
		fetchData(courseID, lesson)
		return lesson != null
			? JSON.parse(localData)[lesson]
			: JSON.parse(localData)
	} else {
		const res = await fetchData(courseID, lesson)
		return res
	}

	async function fetchData(courseID, lesson) {
		return axios
			.post("https://enpegcr0bq40jrt.m.pipedream.net", { course: courseID })
			.then((res) => {
				const decompressedCSV = decompress(res.data.data.toString(), {
					inputEncoding: "StorageBinaryString",
				})
				const parsed = parse(decompressedCSV, {
					header: true,
					dynamicTyping: true,
				})
				if (parsed.errors.length > 0) {
					console.error("Error when parsing data:")
					console.error(parsed.errors)
				}
				localStorage.setItem(courseID, JSON.stringify(parsed.data))
				return parsed.data
			})
			.catch((err) => {
				console.error("Thumbnail fetching failed")
				if (err.response) {
					console.error(err.response.status)
					console.error(err.response.data)
					console.error(err.response.headers)
				} else if (err.request) console.error(err.request)
				else console.error(err.message)
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
		await createVideoView(data[Number(queries.get("lesson")) - 1], courseID)
	)
	viewWrapper.classList.remove("hide")
}

async function resetSidebar(data) {
	sidebar.replaceChildren(await createSidebar(data, courseID))
}

async function routeDefault(data) {
	resetVideoView()
	resetSidebar(data)
}
