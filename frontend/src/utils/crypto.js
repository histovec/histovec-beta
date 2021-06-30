const textEncoder = window.TextEncoder && new window.TextEncoder()

export const hash = async (message) => {
	const data = textEncoder.encode(message)
	return window.crypto.subtle.digest('SHA-256', data)
}
