import router from '@/router';

const redirectionPageErreur = (status) => {
  if (status === 200) {
    return
  }

  if (status === 500) {
    // Cas: Aucune Reponse du back
    router.push({
      name: 'erreurInattendue',
    })
    return
  }

  if (status === 404) {
    // Cas: véhicule non trouvé
    router.push({
      name: 'pageNonTrouvee',
      query: {
        errorTitle: 'Ce véhicule est inconnu d\'HistoVec',
        errorMessages: JSON.stringify([
          'Vos noms et prénoms sont susceptibles d\'avoir fait l\'objet d\'erreurs lors de la saisie de votre dossier.',
          'Recopiez exactement les données de votre certificat d\'immatriculation. Le certificat d\'immatriculation que vous utilisez n\'est peut-être pas le dernier en cours de validité (perte, vol, ...).',
        ]),
        primaryAction: JSON.stringify({
          label: 'Revenir au formulaire de recherche',
          icon: 'ri-arrow-right-fill',
          to: '/proprietaire',
        }),
      },
    })
    return
  }

  // Cas: erreur lors de la récupération du rapport (hors contrôles techniques)
  router.push({
    name: 'serviceIndisponible',
  })
}

export default {
  redirectionPageErreur,
}
