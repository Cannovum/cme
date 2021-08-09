import Player from "@vimeo/player"

export default async function createVideoView(lesson) {
	const wrapper = document.createElement("div")
	wrapper.classList.add("lesson_wrapper", "mt40")

	//* Video
	const playerOptions = {
		byline: false,
		title: false,
		width: "687px",
	}

	const playerContainer = document.createElement("div")
	playerContainer.classList.add("lecture_video-container")

	const playerDiv = document.createElement("div")
	playerDiv.classList.add("course_player_video")
	playerDiv.setAttribute("data-vimeo-id", lesson["vimeo_link"])
	wrapper.player = new Player(playerDiv, playerOptions)
	playerContainer.appendChild(playerDiv)

	const player = wrapper.player
	player.on("loaded", () => console.log("VIDEO LOADED"))
	player.on("play", () => {
		console.log("BUOO")
		checkPlayer()
		console.log("YOO")
	})
	player.on("timeupdate", () => {
		checkPlayer()
	})

	function checkPlayer() {
		console.log("HIIIII")
		// console.log(("Logged: " + loggedIn, "public: " + lesson["public"]))

		if (true) {
			//!loggedIn && !lesson["public"]
			player.unload()
			playerDiv.innerHTML = `
			<p>Bitte loggen Sie sich ein um das Video zu sehen</p>
			<iframe align="left" frameborder="0" scrolling="no" width="467" height="231" name="dc_login_iframe" id="dc_login_iframe" src="https://login.doccheck.com/code/de/2000000017764/login_xl/" style="border-radius: 16px"><a href="https://login.doccheck.com/code/de/2000000017764/login_xl/" target="_blank">LOGIN</a></iframe>`

			sessionStorage.setItem("redirect", window.location.href)
		}
	}

	//* Description
	const videoDesc = document.createElement("div")
	videoDesc.classList.add("video_desc")
	const content = `
    <div class="">
      <h2>${lesson["name"]}</h2>
      <p class="video_desc">${lesson["text"]}</p>
    </div>`
	videoDesc.innerHTML = content

	// Append nodes
	wrapper.append(playerContainer, videoDesc)

	return wrapper
}
