const reponseRequeteApiSivParticulier200 = require('./reponseRequeteApiSivParticulier200');

exports.donneesSIVProfessionnel = {
    ...reponseRequeteApiSivParticulier200.donneesSIVParticulier,
    proprietaire: {
      ...reponseRequeteApiSivParticulier200.donneesSIVParticulier.proprietaire,
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
      ...reponseRequeteApiSivParticulier200.donneesSIVParticulier.incomingQuery,
      sivPhysique: null,
      sivMorale: {
        raisonSociale: 'ZMF AUTO',
        siren: '800289522',
        immat: 'AA-149-BY',
        numeroFormule: '2012fp66022',
      },
    },
  }
