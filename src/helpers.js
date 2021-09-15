import axios from "axios"

export function loggedIn() {
	if (memberstack) return memberstack.isAuthenticated || false
	else return false
}

export async function getMsMetaData() {
	let result = {}
	await MemberStack.onReady.then(async (member) => {
		if (!member.loggedIn) result = false
		else result = await member.getMetaData()
	})
	console.log("MS DATA: ")
	console.log(result)
	return result
}

export async function getVimeoThumbnail(id) {
	// Work with ID and a URL like "https://vimeo.com/23293646"
	// Returns the link to the image
	id = id.split("/").slice(-1)[0]
	console.log("Thumb ID")
	console.log(id)

	return axios
		.get("https://enaprj2nqk3s67o.m.pipedream.net", {
			params: { vimeoID: id },
		})
		.then((res) => res.data.data)
		.catch((err) => {
			if (err.response) {
				console.error(err.response.status)
				console.error(err.response.data)
				console.error(err.response.headers)
			} else if (err.request) console.error(err.request)
			else console.error(err.message)
		})
}
