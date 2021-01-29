import base64ArrayBuffer from 'base64-arraybuffer'

const textEncoder = window.TextEncoder && new window.TextEncoder()

const digestMessage = async (message) => {
	const data = textEncoder.encode(message)
	return window.crypto.subtle.digest('SHA-256', data)
}

export const urlSafeBase64Encode = async (text) => {
	const digestBuffer = await digestMessage(text)
	const urlUnsafeBase64Encoded = base64ArrayBuffer.encode(digestBuffer)

  // Replace + by - and / by _ in a single pass
  return urlUnsafeBase64Encoded.replace(/[+/]/g, char => char === '+' ? '-' : '_')
}