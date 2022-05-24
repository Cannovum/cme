import { getMsMetaData, getVimeoThumbnail, checkIsLoggedIn } from "./helpers"

export default async function createSidebar(data, courseID) {
	const isLoggedIn = await checkIsLoggedIn()

	const queries = new URL(window.location.href).searchParams
	const view = queries.get("view")

	const sidebar = document.createElement("div") // Main	element

	if (!isLoggedIn) {
		const loginBox = sidebar.appendChild(_createLoginbox())
	}

	switch (view) {
		case "watch":
			sidebar.appendChild(await _createCurricuum(data, queries))
			break

		default:
			if (!isLoggedIn) sidebar.appendChild(_createFeatureList(data))
			else sidebar.appendChild(await _createLastWatch(data, courseID))
	}

	return sidebar
}

function _createLoginbox() {
	// * Wrapper
	const wrapper = document.createElement("div")
	wrapper.classList.add("sticky_meta_lecture")

	// * Title
	const titleAndButton = document.createElement("div")
	titleAndButton.classList.add("mb40")
	const title = document.createElement("p")
	title.classList.add("h3")
	title.innerText = "Zugriff auf alle Lektionen"

	// * Button
	const buttonWrapper = document.createElement("a")
	buttonWrapper.classList.add("button", "w100p", "shadow-lv2", "w-inline-block")
	buttonWrapper.href = window.location.origin + "/member/denied" // https://cme-testt.webflow.io/member/denied
	buttonWrapper.setAttribute("data-dc-login", true)
	buttonWrapper.setAttribute("data-login-redirect", window.location.href)
	const buttonInner = document.createElement("div")
	buttonInner.classList.add("button-inner")
	buttonInner.innerText = "Login"

	titleAndButton.append(title, buttonWrapper)
	buttonWrapper.append(buttonInner)

	// Append all elements to wrapper
	wrapper.append(titleAndButton)

	return wrapper
}

async function _createCurricuum(data, queries) {
	const activeLesson = Number(queries.get("lesson"))
	const activeLessonIndex = activeLesson - 1
	const activeChapter = data[activeLessonIndex].chapter

	// *** Build DOM
	const curriculum = document.createElement("div")
	curriculum.classList.add("sticky_curriculum")

	const titleWrapper = document.createElement("div")
	titleWrapper.classList.add("sticky_curriculum-title_wrapper")
	const titleHeading = document.createElement("h2")
	titleHeading.classList.add("normal-text", "bold", "black", "m0")
	titleHeading.innerText = "Curriculum"
	const dropdownArrow = document.createElement("img")
	dropdownArrow.classList.add("tablet-show", "ml16")
	dropdownArrow.src =
		"https://uploads-ssl.webflow.com/60926f7c9d2b2e26dc68b384/6165669c3d9f3e6465a1cb08_chevron-down%20-black.svg"
	titleWrapper.append(titleHeading, dropdownArrow)

	const contentWrapper = document.createElement("div")
	contentWrapper.classList.add(
		"sticky_curriculum-content_wrapper",
		"sticky_curriculum-content-wrapper_hide"
	)

	titleWrapper.onclick = () => {
		contentWrapper.classList.toggle("sticky_curriculum-content-wrapper_hide")
		dropdownArrow.classList.toggle("rotate-180")
	}
	curriculum.append(titleWrapper, contentWrapper)

	// Sort data in chapters
	const chapters = data.reduce((acc, curr) => {
		// [{lektion},{lektion}...] -> [[chapter{lektion}], [chapter{lektion}]...]
		if (!acc[curr.chapter]) {
			// Hat der accumulator nicht den Index / Nummer vom Chapter
			acc[curr.chapter] = [curr] //dann füge die Lektion in einem Array ein
		} else {
			// Ansonsten push die Lektion in den Array vom Index des dazugehörigen Chapters
			acc[curr.chapter].push(curr)
		}
		return acc
	}, [])

	chapters.forEach((chapter, index) => {
		// ** Erstellung der Curriculum Elemente

		// * Wrapper

		const chapterWrapper = document.createElement("div")
		chapterWrapper.classList.add("cme-sidebar_chapter-container")

		// * Title Wrapper
		const titleWrapper = document.createElement("div")
		titleWrapper.classList.add("cme-sidebar_chapter-title-container")

		const title = document.createElement("h3")
		title.classList.add("normal-text", "bold", "mtb0", "black", "break-word")
		title.innerText = chapter[0]["chapter_title"]

		if (activeChapter == index) {
			const chapterIndicator = document.createElement("div")
			chapterIndicator.classList.add("dot", "bg_primary", "mr12")
			titleWrapper.appendChild(chapterIndicator)
		}
		titleWrapper.append(title)

		const lessonsWrapper = document.createElement("div")
		lessonsWrapper.classList.add("cme-sidebar_curr-content")

		chapterWrapper.append(titleWrapper, lessonsWrapper)

		chapter.forEach(async (lesson) => {
			//For each lesson in chapter

			const isActiveLeson = lesson.episode == activeLesson

			// * Lektionsblock
			const lessonContainer = await createLessonEntry_(isActiveLeson, lesson)

			lessonsWrapper.append(lessonContainer)
		})
		contentWrapper.append(chapterWrapper)
	})

	return curriculum

	async function createLessonEntry_(isActiveLeson, lesson) {
		const isLoggedIn = await checkIsLoggedIn()

		const lessonContainer = document.createElement("a")
		lessonContainer.classList.add(
			"cme-sidebar_curr-li",
			"w-inline-block",
			"hover-primary"
		)
		if (isActiveLeson) lessonContainer.classList.add("text-primary")

		// * HREF bauen
		// * Inner Text (Lesson name)
		const text = document.createElement("span")
		text.innerText = lesson.name

		const lessonText = document.createElement("div")
		lessonText.classList.add("lesson_episode")
		lessonText.innerText = "Lektion " + lesson.episode

		const icon = document.createElement("img")
		icon.classList.add("curr-movie_icon")

		const { unlocked, public: isPublic } = lesson

		if (unlocked && (isPublic || isLoggedIn))
			icon.src = isActiveLeson
				? "https://uploads-ssl.webflow.com/60c715a8f0171b333d99d01c/610aa7f70957136062c1ece8_ic_outline-movie.svg" // active icon
				: "https://uploads-ssl.webflow.com/60c715a8f0171b333d99d01c/60c8bbec6ce11150a3e29131_ic_outline-movie.grey-.svg"
		else if (unlocked && !isPublic && !isLoggedIn)
			icon.src =
				"https://uploads-ssl.webflow.com/60926f7c9d2b2e26dc68b384/6225dbf11e4d4c1d921353f2_ic_outline-lock%20grey.svg"
		else
			icon.src =
				"https://uploads-ssl.webflow.com/60926f7c9d2b2e26dc68b384/60926f7c9d2b2e24a068b3c1_calendar_today.svg"

		if (lesson.unlocked) {
			const url = new URL(window.location.href)
			url.searchParams.set("view", "watch")
			url.searchParams.set("lesson", lesson.episode)
			lessonContainer.href = url.href
			lessonContainer.setAttribute("data-spa-link", true)
			if (!lesson.public && !isLoggedIn)
				lessonContainer.setAttribute(
					"data-tippy-content",
					"Diese Lektion benötigt einen DocCheck Login"
				)
		} else {
			lessonContainer.style.opacity = "0.62"
			lessonContainer.style.cursor = "default"
			lessonContainer.setAttribute(
				"data-tippy-content",
				"Diese Lektion wird erst noch erscheinen"
			)
		}
		lessonContainer.append(text, icon)

		return lessonContainer
	}
}

function _createFeatureList(data) {
	// * Feature list
	// List-item text | icon source
	data = data.filter((element) => element.name !== null)

	const list = [
		[
			"Verfügbar",
			"https://uploads-ssl.webflow.com/60c715a8f0171b333d99d01c/60c715a8f0171b540999d0c6_done%20-success.svg",
		],
		[
			data.length + " " + "Lektionen",
			"https://uploads-ssl.webflow.com/60c715a8f0171b333d99d01c/60c8bbec6ce11150a3e29131_ic_outline-movie.grey-.svg",
		],
		[
			"Unlimitierter Zugang für immer",
			"https://uploads-ssl.webflow.com/60c715a8f0171b333d99d01c/60c8bbec08c9087ba58d2003_mdi_infinity.grey-.svg",
		],
		[
			"Online und in Ihrer eigenen Geschwindigkeit",
			"https://uploads-ssl.webflow.com/60c715a8f0171b333d99d01c/60c8bbec07ca4c422498a55b_ic_outline-tag-faces.grey-.svg",
		],
	]
		.map((e) => {
			const item = document.createElement("div")
			item.classList.add("li_meta_sticky")
			const icon = document.createElement("img")
			icon.classList.add("sidebar_li-icon")
			icon.src = e[1]
			const text = document.createElement("div")
			text.innerText = e[0]

			item.append(icon, text)
			return item
		})
		.reduce((acc, curr) => {
			acc.appendChild(curr)
			return acc
		}, document.createElement("div"))

	return list
}

async function _createLastWatch(data, courseID) {
	const memberData = (await getMsMetaData())[courseID]?.lastWatched

	const {
		episode,
		vimeo_link: vimeoLink = false,
		name,
		chapter_title: chapterTitle,
	} = memberData || data[1]

	const wrapper = document.createElement("div")
	wrapper.classList.add("cme-sidebar_continue-wrapper")

	const url = new URL(window.location.href)
	url.searchParams.set("view", "watch")
	url.searchParams.set("lesson", episode)
	const link = url.href

	let html = ""

	if (vimeoLink) {
		const thumbnailLink = await getVimeoThumbnail(episode, courseID)
		html = `
				<div class="">
				<a href="${link}" class="w-inline-block">
				<div class="h3 mb8 mt0">${
					memberData ? "Weiter anschauen" : "Jetzt beginnen"
				}</div>
			</a>
			<a href="${link}" class="w-inline-block">
			<img src="${thumbnailLink}" loading="lazy" class="cme-sidebar_continue-thumb" id="cme-sidebar-thumbnail">
			</a>
			<a href="${link}" class="w-inline-block">
				<div class="black bold mb4 hover-primary">${name}</div>
			</a>
			<div class="black text-small">Kurs:&nbsp;${chapterTitle} - Lektion ${episode} </div>
			`
	} else {
		html = `
				<div class="">
				<a href="${link}" class="w-inline-block">
				<div class="h3 mb8 mt0">Weiter lernen</div>
			</a>
			<a href="${link}" class="w-inline-block">
				<div class="black bold mb4 hover-primary">${name}</div>
			</a>
			<div class="black text-small">Kurs:&nbsp;${chapterTitle} - Lektion ${episode} </div>
			`
	}

	wrapper.innerHTML = html

	return wrapper
}

/**  
 * Icon check primary
https://uploads-ssl.webflow.com/60c715a8f0171b333d99d01c/6113dc7b99640a9959353878_done%20-success-1.svg
*/
