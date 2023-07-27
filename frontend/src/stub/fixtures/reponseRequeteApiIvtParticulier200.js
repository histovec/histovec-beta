const reponseRequeteApiSivParticulier200 = require('./reponseRequeteApiSivParticulier200');
exports.donneesIVTParticulier = {
    ...reponseRequeteApiSivParticulier200.donneesSIVParticulier,
    proprietaire: {
      ...reponseRequeteApiSivParticulier200.donneesSIVParticulier.proprietaire,
      personnePhysique: {
        nomNaissance: 'nom_prenom_IVT',
        prenom: '',
      },
    },
    incomingQuery: {
      ...reponseRequeteApiSivParticulier200.donneesSIVParticulier.incomingQuery,
      sivPhysique: null,
      ivtPhysique: {
        nomPrenom: 'nom_prenom_IVT',
        immat: '664RLD75',
        dateEmissionCi: '31/05/2023',
      },
    },
  }
