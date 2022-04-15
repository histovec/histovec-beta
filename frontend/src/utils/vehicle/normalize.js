import operationsMapping from '../../assets/json/operations.json'


const normalizeNewHistorique = (historique) => {
  return historique.map(elt => (
    {
      ...elt,
      nature: operationsMapping[elt.opa_type],
    }
  ))
}

export const normalizeVehicule = (vehiculeData) => {
  const {
    historique,
  } = vehiculeData

  const normalizedHistorique = normalizeNewHistorique(historique)

  return {
    ...vehiculeData,
    historique: normalizedHistorique,
  }
}