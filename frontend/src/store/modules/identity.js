export default {
  state: {
    typePersonne: 'particulier',
    typeImmatriculation: '',
    nom: '',
    raisonSociale: '',
    prenom: '',
    dateNaissance: '',
    dateCertificat: '',
    plaque: '',
    siren: '',
    formule: '',
    fniMode: true,
  },
  mutations: {
    updateFniMode (state, fniMode) {
      state.fniMode = fniMode
    },
    updateNom (state, nom) {
      state.nom = nom
    },
    updatePrenom (state, prenom) {
      state.prenom = prenom
    },
    updateRaisonSociale (state, raisonSociale) {
      state.raisonSociale = raisonSociale
    },
    updateSiren (state, siren) {
      state.siren = siren
    },
    updateDateNaissance (state, dateNaissance) {
      state.dateNaissance = dateNaissance
    },
    updateDateCertificat (state, dateCertificat) {
      state.dateCertificat = dateCertificat
    },
    updatePlaque (state, plaque) {
      state.plaque = plaque
    },
    updateFormule (state, formule) {
      state.formule = formule
    },
    updateTypePersonne (state, typePersonne) {
      state.typePersonne = typePersonne
    },
    updateTypeImmatriculation (state, typeImmatriculation) {
      state.typeImmatriculation = typeImmatriculation
    }
  }
}