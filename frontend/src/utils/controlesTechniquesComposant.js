
export const  LabeliserControlesTechniques = (controlesTechniques) => {
  let ariaLabel = 'Graphique représentant l\'évolution du kilométrage relevé lors des controles techniques en fonction des années. '
  if(controlesTechniques && controlesTechniques.length >0){
    for (const controleTechnique of controlesTechniques) {
      ariaLabel = ariaLabel + controleTechnique.date + ': ' + controleTechnique.km + ' km ' + controleTechnique.resultatLibelle + '. '
    }
    return ariaLabel
  }
  return ariaLabel + 'Ce véhicule ne possède actuellement aucun contrôle technique.'
}
