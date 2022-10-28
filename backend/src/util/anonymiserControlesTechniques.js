import { anonymize } from './anonymiserData.js'

export const anonymizedControlesTechniques = (controlesTechniques) => {
  const {
    ct = [],
    ctUpdateDate,
    utacError,
  } = controlesTechniques

  const anonymizedCt = ct.map((ctItem) => (
    {
      ...ctItem,
      ct_immat: anonymize(ctItem.ct_immat),
      ct_vin: anonymize(ctItem.ct_vin, 3),

    }
  ))

  return {
    ct: anonymizedCt,
    ctUpdateDate,
    utacError,
  }
}
