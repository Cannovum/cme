export default async function createCurriculum(data) {
	let result = document.createElement("div")

	// Construct inner DOM
	data
		.reduce((chapters, curr) => {
			// [{lektion},{lektion}...] -> [[chapter{lektion}], [chapter{lektion}]...]
			if (!chapters[curr.chapter]) {
				// Hat der accumulator nicht den Index / Nummer vom Chapter
				chapters[curr.chapter] = [curr] //dann füge die Lektion in einem Array ein
			} else {
				// Ansonsten push die Lektion in den Array vom Index des dazugehörigen Chapters
				chapters[curr.chapter].push(curr)
			}

			return chapters
		}, [])
		.forEach((chapter, index) => {
			// ** Erstellung der HTML Elemente

			// * Wrapper
			const chapterWrapper = document.createElement("div")
			chapterWrapper.classList.add("curr-chapter_wrapper")

			// * Titel
			const titleWrapper = document.createElement("div")
			titleWrapper.classList.add("curr-chapter")
			const title = document.createElement("h3")
			title.classList.add("mtb0")
			title.innerText = chapter[0]["chapter_title"]

			const chapterIndicator = document.createElement("div")
			chapterIndicator.classList.add("curr-chapter_indc", "shadow-lv2")
			chapterIndicator.innerText = "K" + index

			const lessonsWrapper = document.createElement("div")
			lessonsWrapper.classList.add("curr-content")

			chapterWrapper.append(titleWrapper, lessonsWrapper)
			titleWrapper.append(chapterIndicator, title)

			chapter.forEach((arr) => {
				//For each lesson in chapter

				// * Lektionsblock
				const lessonContainer = document.createElement("a")
				lessonContainer.classList.add("curr-li", "w-inline-block")
				lessonContainer.setAttribute("data-spa-link", true)

				// * HREF build
				const url = new URL(window.location.href)
				url.searchParams.set("view", "watch")
				url.searchParams.set("lesson", arr.episode)
				lessonContainer.href = url.href

				// * Inner Text (Lesson name)
				const text = document.createTextNode(arr.name)

				const lesson = document.createElement("div")
				lesson.classList.add("lesson_episode")
				lesson.innerText = "Lektion " + arr.episode

				const icon = document.createElement("img")
				icon.classList.add("curr-movie_icon")
				icon.src =
					"https://uploads-ssl.webflow.com/60c715a8f0171b333d99d01c/60c8bbec6ce11150a3e29131_ic_outline-movie.grey-.svg"

				lessonsWrapper.append(lessonContainer)
				lessonContainer.append(icon, text)
			})
			result.append(chapterWrapper)
		})

	return result
}
