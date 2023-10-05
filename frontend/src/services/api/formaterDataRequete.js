import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from '@Constants/type.js'

const formaterDataSivParticulier = (dataFormulaire) => {
  return {
    nom: dataFormulaire.titulaire.particulier.nom,
    prenom: dataFormulaire.titulaire.particulier.prenoms,
    numeroFormule: dataFormulaire.numeroFormule,
    immat: dataFormulaire.numeroImmatriculation,
  }
}

const formaterDataSivPersonneMorale = (dataFormulaire) => {
  return {
    raisonSociale: dataFormulaire.titulaire.personneMorale.raisonSociale,
    siren: dataFormulaire.titulaire.personneMorale.numeroSiren,
    numeroFormule: dataFormulaire.numeroFormule,
    immat: dataFormulaire.numeroImmatriculation,
  }
}

const formaterDataFniParticulier = (dataFormulaire) => {
  return {
    nomPrenom: dataFormulaire.titulaire.particulier.nomEtPrenoms,
    dateEmissionCi: dataFormulaire.dateEmissionCertificatImmatriculation,
    immat: dataFormulaire.numeroImmatriculation,
  }
}

const formaterDataFniPersonneMorale = (dataFormulaire) => {
  return {
    raisonSociale: dataFormulaire.titulaire.personneMorale.raisonSociale,
    siren: dataFormulaire.titulaire.personneMorale.numeroSiren,
    dateEmissionCi: dataFormulaire.dateEmissionCertificatImmatriculation,
    immat: dataFormulaire.numeroImmatriculation,
  }
}

export const formaterDataRequete = (dataFormulaire) => {
  let data

  if (dataFormulaire.typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
    if (dataFormulaire.typePersonne === TYPE_PERSONNE.PARTICULIER) {
      data = formaterDataSivParticulier(dataFormulaire.siv)
    }
    if (dataFormulaire.typePersonne === TYPE_PERSONNE.PRO) {
      data = formaterDataSivPersonneMorale(dataFormulaire.siv)
    }
  }

  if (dataFormulaire.typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
    if (dataFormulaire.typePersonne === TYPE_PERSONNE.PARTICULIER) {
      data = formaterDataFniParticulier(dataFormulaire.fni)
    }
    if (dataFormulaire.typePersonne === TYPE_PERSONNE.PRO) {
      data = formaterDataFniPersonneMorale(dataFormulaire.fni)
    }
  }

  // todo a supprimer a la fin de la refonte
  // ---- Debut a supprimer
  /*
  return {
    uuid: 'd2cbf892-0f7a-401a-8f05-f71b941d1ab8',
    particulier: {
      nom: 'BLANCHET',
      prenoms: ['MARCEL'],
    },
    vehicule: {
      numero_immatriculation: 'AA-948-BM',
      numero_formule: '2015CC11207',
    },
    options: {
      controles_techniques: true,
    },
  }
  */
  // ---- Fin a supprimer

  return data
}
