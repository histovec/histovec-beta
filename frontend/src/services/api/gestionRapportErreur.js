import router from '@/router';

const redirectionPageErreur = (status) => {
  switch (status) {
    case 200:
      return
    case 404:
      // Cas: véhicule non trouvé
      router.push({
        name: 'vehiculeNonTrouve',
      })
      break;
    case 500:
      // Cas: Aucune Reponse du back
      router.push({
        name: 'erreurInattendue',
      })
      break;
    case 503:
    default:
      // Cas: erreur lors de la récupération du rapport (hors contrôles techniques)
      router.push({
        name: 'serviceIndisponible',
      })
      break;
  }
}

export default {
  redirectionPageErreur,
}
