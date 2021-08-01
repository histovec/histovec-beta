import { hash } from '../../../util/crypto.js'


// Use a default value to compute utacDataKey for annulationCI vehicles
export const computeUtacDataKey = (encryptedImmat = 'h4ZWsQLmpOZf') => {
  const hashedEncryptedImmat = hash(encryptedImmat)

  // SivData is encrypted with a base64 encoded key,
  // so we do the same for utacData key in order to have the same way to encrypt / decrypt all our data (sivData and utacData)
  const truncatedHashedEncryptedImmat = Buffer.from(hashedEncryptedImmat, 'base64').slice(0, 32).toString('base64')

  return truncatedHashedEncryptedImmat
}

export const normalizeImmatForUtac = (immat) => {
  if (!immat || typeof immat !== 'string') {
    return undefined
  }

  return (
    immat.toUpperCase()
      .replace(/^([A-Z]+)(\s|-)*([0-9]+)(\s|-)*([A-Z]+)$/, '$1-$3-$5')
      .replace(/^([0-9]+)(\s|-)*([A-Z]+)(\s|-)*([0-9]+)$/, '$1$3$5')
  )
}

export const validateTechnicalControls = (sentVin, technicalControls) => {
  const inconsistentVin = technicalControls.find(ct => ct.ct_vin !== sentVin)

  if (inconsistentVin) {
    appLogger.error({
      message: 'VINs are differents',
    })
    return false
  }

  // Immatriculations could have change while changing from FNI to SIV

  return true
}
