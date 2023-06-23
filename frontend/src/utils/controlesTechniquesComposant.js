import orderBy from 'lodash.orderby'

import { formatIsoToFrDate } from '@Assets/js/format.js'

export const  LabeliserControlesTechniques = (controlesTechniques) => {
  let ariaLabel = 'Graphique représentant l\'évolution du kilométrage relevé lors des controles techniques en fonction des années. '
  const controlesTechniquesNormalize = normalizedControlesTechniquesHistorique(controlesTechniques)
  if(controlesTechniquesNormalize && controlesTechniquesNormalize.length >0){
    for (const controleTechnique of controlesTechniquesNormalize) {
      ariaLabel = ariaLabel + controleTechnique.date + ': ' + controleTechnique.km + ' km ' + controleTechnique.resultatLibelle + '. '
    }
    return ariaLabel
  }
  return ariaLabel + 'Ce véhicule ne possède actuellement aucun contrôle technique.'

}

export const normalizedControlesTechniquesHistorique = (controlesTechniques) => {
  if (controlesTechniques && controlesTechniques.length > 0) {
    const orderedControlesTechniques = orderBy(controlesTechniques, ['date'], ['desc'])

    return orderedControlesTechniques.map((controleTechnique) => {
      return {
        ...controleTechnique,
        date: formatIsoToFrDate(controleTechnique.date),
      }
    })
  }

  return []
}
