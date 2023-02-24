import {TYPE_IMMATRICULATION, TYPE_PERSONNE} from '@/constants/type.js'

export const CHAMP_MODIFIE = {
  SIV_NOM: 'SIV_NOM',
  SIV_PRENOM: 'SIV_PRENOM',
  SIV_RAISON_SOCIALE: 'SIV_RAISON_SOCIALE',
  SIV_SIREN: 'SIV_SIREN',
  SIV_IMMATRICULATION: 'SIV_IMMATRICULATION',
  SIV_FORMULE: 'SIV_FORMULE',
  FNI_NOM_PRENOM: 'FNI_NOM_PRENOM',
  FNI_IMMATRICULATION: 'FNI_IMMATRICULATION',
  FNI_DATE_CERTIFICAT: 'FNI_DATE_CERTIFICAT',
  FNI_RAISON_SOCIALE: 'FNI_RAISON_SOCIALE',
  FNI_SIREN: 'FNI_SIREN',
};

export function collerPressePapierEtDistribuerDansFormulaire(formData, champModifie, event) {
  event.preventDefault()
  console.log(event)
  let dataCopiee = event.clipboardData.getData('text')
  let dataSplite = dataCopiee.toString().replace(/\s*$/, '').split(/\t+/)

  if (dataSplite.length > 1) {
    if (formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
      if (formData.typePersonne === TYPE_PERSONNE.PARTICULIER) {
        formData.siv.titulaire.particulier.nom = dataSplite[0] ?? ''
        formData.siv.titulaire.particulier.prenoms = dataSplite[1] ?? ''
      }
      if (formData.typePersonne === TYPE_PERSONNE.PRO) {
        formData.siv.titulaire.personneMorale.raisonSociale = dataSplite[0] ?? ''
        formData.siv.titulaire.personneMorale.numeroSiren = dataSplite[1] ?? ''
      }
      formData.siv.numeroImmatriculation = dataSplite[2] ?? ''
      formData.siv.numeroFormule = dataSplite[3] ?? ''
    }
    if (formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
      if (formData.typePersonne === TYPE_PERSONNE.PARTICULIER) {
        formData.fni.titulaire.particulier.nomEtPrenoms = dataSplite[0] ?? ''
        formData.fni.numeroImmatriculation = dataSplite[1] ?? ''
        formData.fni.dateEmissionCertificatImmatriculation = dataSplite[2] ?? ''
      }
      if (formData.typePersonne === TYPE_PERSONNE.PRO) {
        formData.fni.titulaire.personneMorale.raisonSociale = dataSplite[0] ?? ''
        formData.fni.titulaire.personneMorale.numeroSiren = dataSplite[1] ?? ''
        formData.fni.numeroImmatriculation = dataSplite[2] ?? ''
        formData.fni.dateEmissionCertificatImmatriculation = dataSplite[3] ?? ''
      }
    }
  } else {
    collerSimple(formData, champModifie, dataCopiee);
  }
  return true;
}

function collerSimple(formData, champModifie, dataCopiee) {
  switch (champModifie) {
    case CHAMP_MODIFIE.SIV_NOM:
      formData.siv.titulaire.particulier.nom = dataCopiee;
      break;
    case CHAMP_MODIFIE.SIV_PRENOM:
      formData.siv.titulaire.particulier.prenoms = dataCopiee;
      break;
    case CHAMP_MODIFIE.SIV_RAISON_SOCIALE:
      formData.siv.titulaire.personneMorale.raisonSociale = dataCopiee;
      break;
    case CHAMP_MODIFIE.SIV_SIREN:
      formData.siv.titulaire.personneMorale.numeroSiren = dataCopiee;
      break;
    case CHAMP_MODIFIE.SIV_IMMATRICULATION:
      formData.siv.numeroImmatriculation = dataCopiee;
      break;
    case CHAMP_MODIFIE.SIV_FORMULE:
      formData.siv.numeroFormule = dataCopiee;
      break;
    case CHAMP_MODIFIE.FNI_SIREN:
      formData.fni.titulaire.personneMorale.numeroSiren = dataCopiee;
      break;
    case CHAMP_MODIFIE.FNI_RAISON_SOCIALE:
      formData.fni.titulaire.personneMorale.raisonSociale = dataCopiee;
      break;
    case CHAMP_MODIFIE.FNI_NOM_PRENOM:
      formData.fni.titulaire.particulier.nomEtPrenoms = dataCopiee;
      break;
    case CHAMP_MODIFIE.FNI_IMMATRICULATION:
      formData.fni.numeroImmatriculation = dataCopiee;
      break;
    case CHAMP_MODIFIE.FNI_DATE_CERTIFICAT:
      formData.fni.dateEmissionCertificatImmatriculation = dataCopiee;
      break;
  }
}
