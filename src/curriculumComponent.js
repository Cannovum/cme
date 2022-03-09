import { checkIsLoggedIn } from "./helpers"

export default async function createCurriculum(data) {
	let result = document.createElement("div")

	// Construct inner DOM
	data
		.reduce((chapters, lesson) => {
			// [{lektion},{lektion}...] -> [[chapter{lektion}], [chapter{lektion}]...]
			if (!chapters[lesson.chapter]) {
				// Hat der accumulator nicht den Index / Nummer vom Chapter
				chapters[lesson.chapter] = [lesson] //dann füge die Lektion in einem Array ein
			} else {
				// Ansonsten push die Lektion in den Array vom Index des dazugehörigen Chapters
				chapters[lesson.chapter].push(lesson)
			}

			return chapters
		}, [])
		.forEach((chapter) => {
			// ** Erstellung der HTML Elemente
			const chapterElement = createChapterEntry_(chapter)

			chapter.forEach(async (lesson) => {
				const lessonElement = await createLessonListElement_(lesson)

				chapterElement.addLessonElement(lessonElement)
			})

			result.append(chapterElement)
		})

	return result
}

function createChapterEntry_(chapterData) {
	const chapterWrapper = document.createElement("div")
	chapterWrapper.classList.add("curr-chapter_wrapper")
	chapterWrapper.addLessonElement = addLesson

	// * Titel
	const titleWrapper = document.createElement("div")
	titleWrapper.classList.add("curr-chapter")
	const title = document.createElement("h3")
	title.classList.add("mtb0")
	title.innerText = chapterData[0]["chapter_title"]

	const chapterIndicator = document.createElement("div")
	chapterIndicator.classList.add("curr-chapter_indc", "shadow-lv2")
	chapterIndicator.innerText = "K" + chapterData[0].chapter

	const lessonsWrapper = document.createElement("div")
	lessonsWrapper.classList.add("curr-content")

	chapterWrapper.append(titleWrapper, lessonsWrapper)
	titleWrapper.append(chapterIndicator, title)

	return chapterWrapper

	function addLesson(lessonElement) {
		lessonsWrapper.append(lessonElement)
	}
}

async function createLessonListElement_(lessonData) {
	// * Lektionsblock
	const isLoggedIn = await checkIsLoggedIn()
	const { unlocked, public: isPublic } = lessonData

	const lessonContainer = document.createElement("a")
	lessonContainer.classList.add("curr-li", "w-inline-block")

	// * Inner Text (Lesson name)
	const text = document.createElement("span")
	text.innerText = lessonData.name

	const lesson = document.createElement("div")
	lesson.classList.add("lesson_episode")
	lesson.innerText = "Lektion " + lessonData.episode

	const icon = document.createElement("img")
	icon.classList.add("curr-movie_icon")

	//Set icon
	if (unlocked && isPublic)
		icon.src =
			"https://uploads-ssl.webflow.com/60c715a8f0171b333d99d01c/60c8bbec6ce11150a3e29131_ic_outline-movie.grey-.svg"
	else if (unlocked && !isPublic)
		icon.src =
			"https://uploads-ssl.webflow.com/60926f7c9d2b2e26dc68b384/6225dbf11e4d4c1d921353f2_ic_outline-lock%20grey.svg"
	else
		icon.src =
			"https://uploads-ssl.webflow.com/60926f7c9d2b2e26dc68b384/60926f7c9d2b2e24a068b3c1_calendar_today.svg"

	if (unlocked === true) {
		lessonContainer.setAttribute("data-spa-link", true) // Its a CME link
		// * HREF build
		const url = new URL(window.location.href)
		url.searchParams.set("view", "watch")
		url.searchParams.set("lesson", lessonData.episode)
		lessonContainer.href = url.href
		if (isPublic === 0 && !isLoggedIn) {
			text.setAttribute(
				"data-tippy-content",
				"Diese Lektion benötigt einen DocCheck Login"
			)
			icon.setAttribute(
				"data-tippy-content",
				"Diese Lektion benötigt einen DocCheck Login"
			)
		}
	} else {
		lessonContainer.style.opacity = "0.62"
		lessonContainer.style.cursor = "default"
		text.setAttribute(
			"data-tippy-content",
			"Diese Lektion wird erst noch erscheinen"
		)
	}

	lessonContainer.append(icon, text)

	return lessonContainer
}
