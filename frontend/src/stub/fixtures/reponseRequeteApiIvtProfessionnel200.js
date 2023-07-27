const reponseRequeteApiSivParticulier200 = require('./reponseRequeteApiSivParticulier200');

exports.donneesIVTProfessionnel = {
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
      ivtMorale: {
        raisonSociale: 'raison_sociale',
        siren: 'siren',
        immat: '664RLD75',
        dateEmissionCi: '31/05/2023',
      },
    },
  }
