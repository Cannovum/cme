export default async function VideoView(course, lesson) {
  const videoWrapper = document.createElement("div")
  videoWrapper.classList.add("lesson_wrapper")
  const playerOptions = {
    byline: false,
    title: false,
    width: "600px",
    id: "https://vimeo.com/270665447",
  }
  const lessonData = await getCoursesData(course, lesson)
  const vimeoLink = lessonData["vimeo_link"]

  playerOptions.id = vimeoLink
  const playerDiv = document.createElement("div")
  playerDiv.classList.add("player")
  videoWrapper.player = new Vimeo.Player(playerDiv, playerOptions)

  const videoDesc = document.createElement("div")
  videoDesc.classList.add("video_desc")
  const content = `
    <div class="">
      <h2>${lessonData["name"]}</h2>
      <p class="video_desc">${lessonData["text"]}</p>
    </div>`
  videoDesc.innerHTML = content

  videoWrapper.append(playerDiv, videoDesc)

  return videoWrapper
}
