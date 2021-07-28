//https://mocki.io/v1/3172ef8d-e1b7-4769-b4a0-f22918057fb1
//https://enpegcr0bq40jrt.m.pipedream.net

import LZUTF8 from "./lzutf8.min.js"
import Papa from "./papaparse.min.js"
import courseOverview from "./courseOverview.js"
import videoView from "./videoView.js"

const courseWrapper = document.querySelector(".curriulum_c_wrapper")
const course = document.querySelector("#course_data").getAttribute("data-course")

window.addEventListener("popstate", (e) => {
  router(window.location.href)
})

document.addEventListener("DOMContentLoaded", () => router(window.location.href))

async function navigateTo(url, replace = false, stateData = null) {
  history.pushState(null, null, url)
  router(url)
}

async function router(url) {
  const queries = new URL(url).searchParams
  const routes = [
    {
      name: "courses",
      view: async () => {
        const data = await getCoursesData(course)
        courseWrapper.append(await courseOverview(data))
      },
    },
    {
      name: "watch",
      view: async () => courseWrapper.append(await videoView(course, Number(queries.get("lesson")))),
    },
    {
      name: "notFound",
      view: async () => {
        console.log("not found")
        const data = await getCoursesData(course)
        const overview = courseWrapper.appendChild(await courseOverview(data))
        overview.update()
      },
    },
  ]
  const queryView = queries.get("view")
  const match = queryView // If "view" is set
    ? // find matching view
      routes.find((route) => {
        return queryView === route.name
      }) || routes.find((route) => route.name === "notFound") // if not found, use notFound
    : routes[2] // routes.find((route) => route.view === "courses") // else use courses view

  courseWrapper.innerHTML = ""
  match.view()
}

async function getCoursesData(course, lesson = null) {
  lesson = lesson ? lesson - 1 : null
  const localData = localStorage.getItem(course)
  if (localData) {
    fetchData(course, lesson)
    return lesson != null ? JSON.parse(localData)[lesson] : JSON.parse(localData)
  } else {
    return await fetchData(course, lesson)
  }

  async function fetchData(course, lesson) {
    const result = await fetch("https://mocki.io/v1/3172ef8d-e1b7-4769-b4a0-f22918057fb1", {
      // method: "POST",
      // body: JSON.stringify({ //?Re-enable later
      //   course: "kurs_1",
      // }),
    })
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

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-spa-link]")) {
      e.preventDefault()
      navigateTo(e.target.href)
    }
  })
})
