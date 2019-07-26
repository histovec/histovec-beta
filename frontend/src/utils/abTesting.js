// Useful while AB testing with a feature flag
// ex:
// const API_V1_PERCENTAGE = process.env.VUE_APP_V1_PERCENTAGE || 0
// const isBetaTestUser = isOptionActivated(localStorage.getItem('userId'), API_V1_PERCENTAGE)

export function isOptionActivated(uuid, pourcentage, base=16, precision=2) {
  const subUuid = uuid.substring(0, precision)
  const value = parseInt(subUuid, base)

  return value < (pourcentage / 100) * (base ** precision)
}
