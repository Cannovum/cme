import Player from "@vimeo/player"

export default async function createVideoView(lesson, courseID, courseData) {
	const wrapper = document.createElement("div")
	wrapper.classList.add("lesson_wrapper", "mt40")

	//* Video
	const playerOptions = {
		byline: false,
		title: false,
		width: 1000,
		maxwidth: 687,
	}
	const playerContainer = document.createElement("div")
	playerContainer.classList.add("lecture_video-container")
	const playerDiv = document.createElement("div")
	playerDiv.classList.add("course_player_video", "vimeo_wrapper")
	playerDiv.setAttribute("data-vimeo-id", lesson["vimeo_link"])
	wrapper.player = new Player(playerDiv, playerOptions)
	playerContainer.appendChild(playerDiv)

	const player = wrapper.player
	player.on("play", () => {
		checkPlayer()
		updateMsLastWatch(lesson, courseID)
	})
	player.on("timeupdate", () => {
		checkPlayer()
	})
	player.on("ended", () => {
		updateMsWatched(lesson, courseID)
	})

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

	function updateMsLastWatch(lesson, courseID) {
		MemberStack.onReady.then(async (member) => {
			if (!member.loggedIn) return
			const memberData = await member.getMetaData()

			const memberProgress = {
				[courseID]: { ...memberData[courseID], lastWatched: lesson },
			}

			member.updateMetaData(memberProgress)
		})
	}

	function updateMsWatched(lesson, courseID) {
		MemberStack.onReady.then(async (member) => {
			if (!member.loggedIn) return

			const oldData = (await member.getMetaData())[courseID] || []
			const updatedData = {
				[courseID]: {
					...oldData,
					watched: [...(oldData.watched || []), lesson["episode"]],
				},
			}
			member.updateMetaData(updatedData)
		})
	}

	async function checkPlayer() {
		if (!lesson["public"]) {
			MemberStack.onReady.then((member) => {
				if (!member.loggedIn) {
					player.unload()
					playerDiv.innerHTML = `
				<p>Bitte loggen Sie sich ein um das Video zu sehen</p>
				<iframe align="left" frameborder="0" scrolling="no" width="467" height="231" name="dc_login_iframe" id="dc_login_iframe" src="https://login.doccheck.com/code/de/2000000016834/login_xl/" ><a href="https://login.doccheck.com/code/de/2000000016834/login_xl/" target="_blank">LOGIN</a></iframe>`

					sessionStorage.setItem("redirect", window.location.href)
				}
			})
		}
	}
}
