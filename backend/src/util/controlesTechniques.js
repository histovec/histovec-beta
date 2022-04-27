import {
  DATE_2018_05_20,
  NATURE_LIBELLES_BEFORE_20_05_2018,
  NATURE_LIBELLES_SINCE_20_05_2018,
  RESULTAT_LIBELLES_BEFORE_20_05_2018,
  RESULTAT_LIBELLES_SINCE_20_05_2018,
} from '../constant/controlesTechniques.js'

export const processControlesTechniques = (controlesTechniques) => {
  const {
    ct = [],
    ctUpdateDate,
    utacError,
  } = controlesTechniques

  const processedCt = ct.map((ctItem) => {
    const natureLibelle = (
      ctItem.ct_date < DATE_2018_05_20
        ? NATURE_LIBELLES_BEFORE_20_05_2018[ctItem.ct_nature]
        : NATURE_LIBELLES_SINCE_20_05_2018[ctItem.ct_nature]
    )

    const resultatLibelle = (
      ctItem.ct_date < DATE_2018_05_20
        ? RESULTAT_LIBELLES_BEFORE_20_05_2018[ctItem.ct_resultat]
        : RESULTAT_LIBELLES_SINCE_20_05_2018[ctItem.ct_resultat]
    )

    return {
      ...ctItem,
      natureLibelle,
      resultatLibelle,
    }
  })

  return {
    ct: processedCt,
    ctUpdateDate,
    utacError,
  }
}
