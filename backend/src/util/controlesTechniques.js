import { DATE_2018_05_20, NATURE_LABELS, RESULTAT_LABELS_SINCE_20_05_2018, RESULTAT_LABELS_BEFORE_20_05_2018 } from '../constant/controlesTechniques.js'


export const processControlesTechniques = (controlesTechniques) => {
  const {
    ct = [],
    ctUpdateDate,
  } = controlesTechniques

  const processedCt = ct.map((ctItem) => {
    const natureLabel = NATURE_LABELS[ctItem.ct_nature]

    const resultatLabel = (
      ctItem.ct_date < DATE_2018_05_20 ?
      RESULTAT_LABELS_BEFORE_20_05_2018[ctItem.ct_resultat] :
      RESULTAT_LABELS_SINCE_20_05_2018[ctItem.ct_resultat]
    )

    return {
      ...ctItem,
      natureLabel,
      resultatLabel,
    }
  })

  return {
    ct: processedCt,
    ctUpdateDate,
  }
}
