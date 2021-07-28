export default async function courseOverview(data) {
  let result = document.createElement("div")
  result.update = () => console.log("Update was called")

  // Construct inner DOM
  data
    .reduce((chapters, curr) => {
      // [{lektion},{lektion}...] -> [[chapter{lektion}], [chapter{lektion}]...]
      if (!chapters[curr.chapter]) {
        // Hat der accumulator nicht den index ( vom Chapter)
        chapters[curr.chapter] = [curr] //dann füge die Lektion in einem Array ein
      } else {
        // Ansonsten push die Lektion in den Array vom Index des dazugehörigen Chapters
        chapters[curr.chapter].push(curr)
      }
      return chapters
    }, [])
    .forEach((chapter, index) => {
      // Erstellung der HTML Elemente
      const chapterWrapper = document.createElement("div")
      chapterWrapper.classList.add("tab_curr-chapter_wrapper")

      const title = document.createElement("div")
      title.classList.add("tab_curr-chapter")

      const chapterIndicator = document.createElement("div")
      chapterIndicator.classList.add("tab_cur-chapter_indc", "shadow-lv2")
      chapterIndicator.innerText = "L" + index

      const lessonsWrapper = document.createElement("div")
      lessonsWrapper.classList.add("tab_cur-content")

      chapterWrapper.append(title, lessonsWrapper)

      chapter.forEach((arr) => {
        //For each lesson in chapter
        const lessonContainer = document.createElement("a")
        lessonContainer.classList.add("tab_cur-li", "w-inline-block")
        lessonContainer.setAttribute("data-spa-link", true)
        const url = new URL(window.location.href)
        url.searchParams.set("view", "watch")
        url.searchParams.set("lesson", arr.episode)
        lessonContainer.href = url.href

        const text = document.createElement("div")
        text.innerText = arr.name

        const lesson = document.createElement("div")
        lesson.classList.add("lesson_episode")
        lesson.innerText = "Lektion " + arr.episode

        lessonsWrapper.append(lessonContainer)
        lessonContainer.append(text)
      })
      result.append(chapterWrapper)
    })

  return result
}
