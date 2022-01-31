import axios from "axios"
import { decompress } from "lzutf8"
import { parse } from "papaparse"

export async function getMsMetaData() {
	return MemberStack.onReady.then(async (member) => {
		if (!member.loggedIn) result = false
		return member.getMetaData()
	})
}

export async function getVimeoThumbnail(episode, courseID) {
	// Work with ID and a URL like "https://vimeo.com/23293646"
	// Returns the link to the image

	return (
		getThumbnailLocalStorage(episode) ||
		axios
			.get("https://enaprj2nqk3s67o.m.pipedream.net", {
				params: {
					vimeoID: (await getCoursesData(courseID, episode)).vimeo_link
						.toString()
						.match(/(?<=\/|\b)[0-9]{6,9}(?!\w)(?=\/|\b)/)[0],
				},
			})
			.then((res) => {
				setThumbnail(res.data.data)
				return res.data.data
			})
			.catch((err) => {
				if (err.response) {
					console.error(err)
					console.error(err.response.status)
					console.error(err.response.data)
					console.error(err.response.headers)
				} else if (err.request) console.error(err.request)
				else console.error(err.message)
			})
	)

	function getThumbnailLocalStorage(episode) {
		return JSON.parse(localStorage.getItem(courseID))[episode - 1]
			?.thumbnailLink
	}

	function setThumbnail(thumbnailLink) {
		let data = JSON.parse(localStorage.getItem(courseID))
		const updatedEdpisode = { ...data[episode - 1], thumbnailLink }
		data[episode - 1] = updatedEdpisode

		localStorage.setItem(courseID, JSON.stringify(data))
	}
}

export async function getCoursesData(courseID, lesson = null) {
	lesson = lesson ? lesson - 1 : null // Lesson starts with 1, but the index with 0, so x = x -1
	const localData = localStorage.getItem(courseID)
	if (localData) {
		return lesson != null
			? JSON.parse(localData)[lesson]
			: JSON.parse(localData)
	} else {
		const res = await fetchData(courseID, lesson)
		return res
	}
}

export async function fetchData(courseID, lesson = null) {
	return axios
		.post("https://enpegcr0bq40jrt.m.pipedream.net", { course: courseID })
		.then((res) => {
			const decompressedCSV = decompress(res.data.data.toString(), {
				inputEncoding: "StorageBinaryString",
			})
			const parsed = parse(decompressedCSV, {
				header: true,
				dynamicTyping: true,
			})
			if (parsed.errors.length > 0) {
				console.error("Error when parsing data:")
				console.error(parsed.errors)
			}
			localStorage.setItem(courseID, JSON.stringify(parsed.data))
			return lesson !== null ? parsed.data[lesson - 1] : parsed.data
		})
		.catch((err) => {
			console.error("Course Data fetching failed")
			console.error({ courseID, lesson })
			if (err.response) {
				console.error("Status:", err.response.status)
				console.error(err.response.data)
				console.error(err.response.headers)
			} else if (err.request) console.error(err.request)
			else console.error(err.message)
		})
}
