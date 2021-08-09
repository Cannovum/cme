export default function createSidebar(data) {
	const queries = new URL(window.location.href).searchParams
	const view = queries.get("view")
	const loggedIn = localStorage.getItem("loggedIn")

	const sidebar = document.createElement("div") // Main	element

	if (!loggedIn) {
		const loginBox = sidebar.appendChild(createLoginbox())
	}

	switch (view) {
		case "watch":
			sidebar.appendChild(createCurricuum(data, queries))

		default:
			if (!loggedIn) sidebar.appendChild(createFeatureList(data))
	}

	return sidebar
}

function createLoginbox() {
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
	buttonWrapper.href = "#LOGIN-SEITE_HIER"
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

function createCurricuum(data, queries) {
	const activeLesson = Number(queries.get("lesson"))
	const activeChapter = data[activeLesson].chapter

	// *** Build DOM
	const curriculum = document.createElement("div")
	curriculum.classList.add("sticky_curriculum")
	const currTitle = document.createElement("h2")
	currTitle.classList.add("normal-text", "bold", "black")
	currTitle.innerText = "Kurs Inhalt"
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
		title.classList.add("normal-text", "bold", "black")
		title.innerText = chapter[0]["chapter_title"]

		const chapterIndicator = document.createElement("div")
		chapterIndicator.classList.add("curr-chapter_indc", "shadow-lv2", "mr16")
		if (index == activeChapter) {
			chapterIndicator.classList.add("bg_primary", "text_white")
		}
		chapterIndicator.innerText = "K" + index

		const lessonsWrapper = document.createElement("div")
		lessonsWrapper.classList.add("cme-sidebar_curr-content")

		chapterWrapper.append(titleWrapper, lessonsWrapper)
		titleWrapper.append(chapterIndicator, title)

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

function createFeatureList(data) {
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
