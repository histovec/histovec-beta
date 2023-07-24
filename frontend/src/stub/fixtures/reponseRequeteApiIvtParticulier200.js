const reponseRequeteApiSivParticulier200 = require('./reponseRequeteApiSivParticulier200');
exports.reponseRequeteApiIvtParticulier200 = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200?.data,
    proprietaire: {
      ...reponseRequeteApiSivParticulier200?.data?.proprietaire,
      personnePhysique: {
        nomNaissance: 'nom_prenom_IVT',
        prenom: '',
      },
    },
    incomingQuery: {
      ...reponseRequeteApiSivParticulier200?.data?.incomingQuery,
      sivPhysique: null,
      ivtPhysique: {
        nomPrenom: 'nom_prenom_IVT',
        immat: '664RLD75',
        dateEmissionCi: '31/05/2023',
      },
    },
  },
}
