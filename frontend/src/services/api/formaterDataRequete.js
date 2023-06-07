import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from '@Constants/type.js'

const formaterDataSivParticulier = (dataFormulaire) => {
  return {
    proprietaire: {
      nom: dataFormulaire.titulaire.particulier.nom,
      prenoms: [dataFormulaire.titulaire.particulier.prenoms],
    },
    vehicule: {
      numero_formule: dataFormulaire.numeroFormule,
      numero_immatriculation: dataFormulaire.numeroImmatriculation,
    },
  }
}

const formaterDataSivPersonneMorale = (dataFormulaire) => {
  return {
    proprietaire: {
      raison_sociale: dataFormulaire.titulaire.personneMorale.raisonSociale,
      siren: dataFormulaire.titulaire.personneMorale.numeroSiren,
    },
    vehicule: {
      numero_formule: dataFormulaire.numeroFormule,
      numero_immatriculation: dataFormulaire.numeroImmatriculation,
    },
  }
}

const formaterDataFniParticulier = (dataFormulaire) => {
  return {
    proprietaire: {
      nom_prenom: dataFormulaire.titulaire.particulier.nomEtPrenoms,
    },
    vehicule: {
      date_emission_ci: dataFormulaire.dateEmissionCertificatImmatriculation,
      numero_immatriculation: dataFormulaire.numeroImmatriculation,
    },
  }
}

const formaterDataFniPersonneMorale = (dataFormulaire) => {
  return {
    proprietaire: {
      raison_sociale: dataFormulaire.titulaire.personneMorale.raisonSociale,
      siren: dataFormulaire.titulaire.personneMorale.numeroSiren,
    },
    vehicule: {
      date_emission_ci: dataFormulaire.dateEmissionCertificatImmatriculation,
      numero_immatriculation: dataFormulaire.numeroImmatriculation,
    },
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

  // eslint-disable-next-line no-unreachable
  return {
    ...data,
    uuid: localStorage.getItem('userId'),
    options: {
      controles_techniques: true,
    },
  }
}
