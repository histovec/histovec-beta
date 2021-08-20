import { DATE_2018_05_20, NATURE_LIBELLES, RESULTAT_LIBELLES_SINCE_20_05_2018, RESULTAT_LIBELLES_BEFORE_20_05_2018 } from '../constant/controlesTechniques.js'


export const processControlesTechniques = (controlesTechniques) => {
  const {
    ct = [],
    ctUpdateDate,
  } = controlesTechniques

  const processedCt = ct.map((ctItem) => {
    const natureLibelle = NATURE_LIBELLES[ctItem.ct_nature]

    const resultatLibelle = (
      ctItem.ct_date < DATE_2018_05_20 ?
      RESULTAT_LIBELLES_BEFORE_20_05_2018[ctItem.ct_resultat] :
      RESULTAT_LIBELLES_SINCE_20_05_2018[ctItem.ct_resultat]
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
  }
}
