import router from '@/router';
import api from '@Api/index.js'

const redirectionPageErreur = async (status) => {
  api.log('test/2.1')
  console.log(3.3)
  if (status === 200) {
    console.log(3.4)
    api.log('test/2.2')
    return
  }
  api.log('test/2.3')
  if (status === 500) {
    console.log(3.5)
    api.log('test/2.4')
    // Cas: Aucune Reponse du back
    router.push({
      name: 'erreurInattendue',
    })
    return
  }
  api.log('test/2.5')
  if (status === 404) {
    console.log(3.6)
    api.log('test/2.6')
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
  api.log('test/2.7')
  console.log(3.7)
  // Cas: erreur lors de la récupération du rapport (hors contrôles techniques)
  router.push({
    name: 'serviceIndisponible',
  })
}

export default {
  redirectionPageErreur,
}
