import { getMsMetaData, getVimeoThumbnail } from "./helpers"

export default async function createSidebar(data, courseID) {
	const queries = new URL(window.location.href).searchParams
	const view = queries.get("view")

	const sidebar = document.createElement("div") // Main	element

	let loggedIn = await MemberStack.onReady.then((member) => {
		return member.loggedIn
	})

	if (!loggedIn) {
		const loginBox = sidebar.appendChild(_createLoginbox())
	}

	switch (view) {
		case "watch":
			sidebar.appendChild(_createCurricuum(data, queries))
			break

		default:
			if (!loggedIn) sidebar.appendChild(_createFeatureList(data))
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
	const buttonInner = document.createElement("div")
	buttonInner.classList.add("button-inner")
	buttonInner.innerText = "Login"

	titleAndButton.append(title, buttonWrapper)
	buttonWrapper.append(buttonInner)

	// Append all elements to wrapper
	wrapper.append(titleAndButton)

	return wrapper
}

function _createCurricuum(data, queries) {
	const activeLesson = Number(queries.get("lesson"))
	const activeLessonIndex = activeLesson - 1
	const activeChapter = data[activeLessonIndex].chapter

	// *** Build DOM
	const curriculum = document.createElement("div")
	curriculum.classList.add("sticky_curriculum")
	const currTitle = document.createElement("h2")
	currTitle.classList.add("normal-text", "bold", "black", "mt0")
	currTitle.innerText = "Curriculum"
	curriculum.appendChild(currTitle)

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
		title.classList.add("normal-text", "bold", "mtb0", "black")
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

		chapter.forEach((arrayLesson) => {
			//For each lesson in chapter

			const isActiveLeson = arrayLesson.episode == activeLesson

			// * Lektionsblock
			const lessonContainer = document.createElement("a")
			lessonContainer.classList.add(
				"cme-sidebar_curr-li",
				"w-inline-block",
				"hover-primary"
			)
			if (isActiveLeson) lessonContainer.classList.add("primary")
			lessonContainer.setAttribute("data-spa-link", true)

			// * HREF bauen
			const url = new URL(window.location.href)
			url.searchParams.set("view", "watch")
			url.searchParams.set("lesson", arrayLesson.episode)
			lessonContainer.href = url.href

			// * Inner Text (Lesson name)
			const text = document.createTextNode(arrayLesson.name)

			const lesson = document.createElement("div")
			lesson.classList.add("lesson_episode")
			lesson.innerText = "Lektion " + arrayLesson.episode

			const icon = document.createElement("img")
			icon.classList.add("curr-movie_icon")

			icon.src = isActiveLeson
				? "https://uploads-ssl.webflow.com/60c715a8f0171b333d99d01c/610aa7f70957136062c1ece8_ic_outline-movie.svg" // active icon
				: "https://uploads-ssl.webflow.com/60c715a8f0171b333d99d01c/60c8bbec6ce11150a3e29131_ic_outline-movie.grey-.svg" // inactive icon

			lessonsWrapper.append(lessonContainer)
			lessonContainer.append(text, icon)
		})
		curriculum.append(chapterWrapper)
	})

	return curriculum
}

function _createFeatureList(data) {
	// * Feature list
	// List-item text | icon source
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
			"Zertifikat nach Abschluss",
			"https://uploads-ssl.webflow.com/60c715a8f0171b333d99d01c/60c8bbecf711d5da59e4b098_ic_outline-assignment.grey-.svg",
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
			<img src="${thumbnailLink}}" loading="lazy" class="cme-sidebar_continue-thumb" id="cme-sidebar-thumbnail">
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
