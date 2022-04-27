// Useful while AB testing with a feature flag
// ex:
// const abTestingPercentage = import.meta.env.VITE_AB_TESTING_PERCENTAGE || 0
// const isBetaTestUser = isOptionActivated(localStorage.getItem('userId'), abTestingPercentage)

export function isOptionActivated(uuid, pourcentage, base=16, precision=2) {
  const subUuid = uuid.substring(0, precision)
  const value = parseInt(subUuid, base)

  return value < (pourcentage / 100) * (base ** precision)
}
