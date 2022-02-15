import { encode } from 'base64-arraybuffer'

export const urlSafeBase64Encode = (buffer) => {
	const urlUnsafeBase64Encoded = encode(buffer)

  // Replace + by - and / by _ in a single pass
  return urlUnsafeBase64Encoded.replace(/[+/]/g, char => char === '+' ? '-' : '_')
}
