const reponseRequeteApiSivParticulier200 = require('./reponseRequeteApiSivParticulier200');

exports.reponseRequeteApiSivProfessionnel200 = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200?.data,
    proprietaire: {
      ...reponseRequeteApiSivParticulier200?.data?.proprietaire,
      personnePhysique: {
        nomNaissance: '',
        prenom: '',
      },
      personneMorale: {
        raisonSociale: 'raison_sociale',
        siren: 'siren',
      },
    },
    incomingQuery: {
      ...reponseRequeteApiSivParticulier200?.data?.incomingQuery,
      sivPhysique: null,
      sivMorale: {
        raisonSociale: 'ZMF AUTO',
        siren: '800289522',
        immat: 'AA-149-BY',
        numeroFormule: '2012fp66022',
      },
    },
  },
}
