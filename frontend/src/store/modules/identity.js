import Vue from 'vue'

export default {
  state: {
    formOptions: undefined,
    typePersonne: 'particulier',
    typeImmatriculation: '',
    nom: '',
    raisonSociale: '',
    prenom: '',
    dateCertificat: '',
    plaque: '',
    siren: '',
    formule: '',
  },
  mutations: {
    clearIdentity (state) {
      state.nom = ''
      state.raisonSociale = ''
      state.prenom = ''
      state.dateCertificat = ''
      state.plaque = ''
      state.siren = ''
      state.formule = ''
    },
    initFormOptions (state, formOptions) {
      state.formOptions = formOptions
    },
    updateFormOptions (state, update) {
      Object.keys(update).forEach( keyPathString => {
        const formOptions = state.formOptions
        const value = update[keyPathString]
        const keyPathArray = keyPathString.split('.')

        let formOption
        for (let i = 0, n = keyPathArray.length - 1; i < n; ++i) {
          const keyPath = keyPathArray[i]
          if (!(keyPath in formOptions)) {
            throw new Error(`updateFormOptions error: path ${keyPathString} not found in formOptions`)
          }
          formOption = formOptions[keyPath]
        }
        Vue.set(formOption, keyPathArray[keyPathArray.length - 1], value)
      })
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