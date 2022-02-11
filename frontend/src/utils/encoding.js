import { decode, encode } from 'base64-arraybuffer'


export const urlSafeDecode = (text) => {
  // Replace - by + and _ by / in a single pass
  return text.replace(/[-_]/g, char => char === '-' ? '+' : '/')
}

export const urlSafeEncode = (text) => {
  // Replace + by - and / by _ in a single pass
  return text.replace(/[+/]/g, char => char === '+' ? '-' : '_')
}

export const urlSafeBase64Encode = (buffer) => {
	const base64Encoded = base64Encode(buffer)

  return urlSafeEncode(base64Encoded)
}

export const urlSafeBase64Decode = (text) => {
  const base64Encoded = urlSafeDecode(text)

  return base64Decode(base64Encoded)
}

export const base64Encode = (buffer) => {
  return encode(buffer)
}

export const base64Decode = (text) => {
  return decode(text)
}
