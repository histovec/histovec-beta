export const decodingJWT = (token) => {
  if (!token) {
    return null
  }

  const base64Payload = token.split('.')[1]
  const decodedPayload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('ascii'))

  return decodedPayload
}
