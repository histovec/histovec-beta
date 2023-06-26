import orderBy from 'lodash.orderby'


export const syntheseVehiculeMapping = (etatCI, isVehiculeVole, syntheseSituationAdministrative) => {
  const {
    doesCIHasDuplicata,
    isCIAnnule,
    isCIPerdu,
    isCIVole,
  } = etatCI

  const {
    hasDeclarationsValantSaisie,
    hasGage,
    hasOtci,
    hasOtciPV,
    hasOve,
    hasOvei,
    hasSuspension,
  } = syntheseSituationAdministrative

  const anomalies = ['annulation_ci', 'ci_vole', 'duplicata', 'gage', 'perte_ci', 'saisie', 'suspension', 'vehicule_vole']
  const anomaliesMapping = {
    annulation_ci: isCIAnnule,
    ci_vole: isCIVole,
    duplicata: doesCIHasDuplicata,
    gage: hasGage,
    perte_ci: isCIPerdu,
    saisie: hasDeclarationsValantSaisie,
    suspension: hasSuspension,
    vehicule_vole: isVehiculeVole,
  }

  const filteredAnomalies = anomalies.filter(anomalie => {
    if (anomalie === 'duplicata') {
      if (isCIPerdu || isCIVole) {
        return false
      }
    }

    return anomaliesMapping[anomalie]
  })

  const otciAnomaly = hasOtci ? 'otci' : (hasOtciPV ? 'otcipv' : '')
  const oveAnomaly = hasOve ? 'ove' : (hasOvei ? 'ovei' : '')

  let oppositionTemporaireAnomaly
  if(otciAnomaly && oveAnomaly) {
    oppositionTemporaireAnomaly = `${otciAnomaly}_${oveAnomaly}`
  } else if(otciAnomaly) {
    oppositionTemporaireAnomaly = otciAnomaly
  } else if(oveAnomaly) {
    oppositionTemporaireAnomaly = oveAnomaly
  }

  if (oppositionTemporaireAnomaly) {
    return [
      ...filteredAnomalies,
      oppositionTemporaireAnomaly,
    ]
  } else {
    return filteredAnomalies
  }
}



export const ordonneParDateAntechronologique = (elements) => {
  return orderBy(
    elements,
    ['date'],
    ['desc'],
  )
}
