//https://mocki.io/v1/3172ef8d-e1b7-4769-b4a0-f22918057fb1
//https://enpegcr0bq40jrt.m.pipedream.net
//------------------------------------------- -------------
import Player from "@vimeo/player"
import createVideoView from "./videoView.js"
import createCurriculum from "./curriculumComponent.js"
import createSidebar from "./sidebar.js"
import { getCoursesData, fetchData } from "./helpers"
import tippy from "tippy.js"
import "tippy.js/dist/tippy.css"
import "./global.css"

const curriculumWrapper = document.querySelector(".curriulum_c_wrapper")
const viewWrapper = document.querySelector("#spa-view-toggle")
const viewContainer = document.querySelector("#spa-view")
const sidebar = document.querySelector(".sticky_meta_lecture")
const curriulumStartpage = document.querySelector("#curriculum_2")
const courseID =
	document.querySelector("#course_data").getAttribute("data-course") || // Erhalte KursID, geprintet von Webflow (Metadatei im CMS)
	console.error("Course ID was not found in document")

;(() => {
	fetchData(courseID)
})() // Fetch course data at the beginning once to force a refresh, just in case the data is outdated

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
	curriulumStartpage.innerHTML = ""
	curriulumStartpage.append(await createCurriculum(data))

	// * Construct overview video in overview tab
	const overviewPlayer = createOverviewVideo()

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
				navigateTo() // Push new state to searchParams
			} else {
				router() // Just switch view
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

	function createOverviewVideo() {
		const playerURL = document
			.querySelector("#overview_video")
			.getAttribute("data-vimeo-url")
		const playerWrapper = document.querySelector("#overview_video")

		playerWrapper.classList.add("vimeo_wrapper")
		const overviewPlayer = new Player(playerWrapper, {
			byline: false,
			title: false,
			width: 687,
			url: playerURL,
		})

		return overviewPlayer
	}
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
				routeDefault(data, courseID)
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
				routeDefault(data, courseID)
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
	tippy("[data-tippy-content]")
}

async function removeVideoView() {
	// Hide the wrapper for other views and unloads its contents
	viewWrapper.classList.add("hide")
	viewContainer.innerHTML = ""
}

async function routeVideo(data, queries) {
	// Switches to Video View
	removeVideoView()
	resetSidebar(data, courseID)

	// * Modify tabs unless they are already modified
	const activeTab = document.querySelector("#spa_main_content .w--tab-active")
	if (activeTab) activeTab.classList.remove("w--tab-active")
	const activeTabContent = document.querySelector(
		"#spa_main_content .w--current"
	)
	if (activeTabContent) activeTabContent.classList.remove("w--current")

	// * Load video view
	viewContainer.innerHTML = ""
	viewContainer.append(
		await createVideoView(data[Number(queries.get("lesson")) - 1], courseID)
	)
	viewWrapper.classList.remove("hide")
	tippy("[data-tippy-content]") //Activate tippy.js tooltips
}

async function resetSidebar(data, courseID) {
	sidebar.innerHTML = ""
	sidebar.append(await createSidebar(data, courseID))
	tippy("[data-tippy-content]") //Activate tippy.js tooltips
}

async function routeDefault(data, courseID) {
	removeVideoView()
	resetSidebar(data, courseID)
	tippy("[data-tippy-content]") //Activate tippy.js tooltips
}
