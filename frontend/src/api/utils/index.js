import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from '@Constants/type.js'
import { DEFAULT_NUMERO_SIREN } from '@Constants/vehicle/numeroSiren.js'


export const buildReportByDataPayload = (
  uuid,
  {
    nom, prenoms, raisonSociale, siren,
    numeroImmatriculation, numeroFormule, dateEmissionCertificatImmatriculation,
  },
  {
    typeImmatriculation, typePersonne, ignoreUtacCache,
  },
) => {
  if (!typeImmatriculation) {
    throw new Error(`type_immatriculation VIDE = ${typeImmatriculation}`)
  }

  if (typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
    if (typePersonne === TYPE_PERSONNE.PARTICULIER) {
      return {
        uuid,
        vehicule: {
          certificat_immatriculation: {
            titulaire: {
              particulier: {
                nom,
                prenoms,
              },
            },
            numero_immatriculation: numeroImmatriculation,
            numero_formule: numeroFormule,
          },
        },
        options: {
          controles_techniques: true,
          ignore_utac_cache: ignoreUtacCache,
        },
      }
    } else {  // typePersonne === TYPE_PERSONNE.PRO
      return {
        uuid,
        vehicule: {
          certificat_immatriculation: {
            titulaire: {
              personne_morale: {
                raison_sociale: raisonSociale,
                siren: siren || DEFAULT_NUMERO_SIREN,
              },
            },
            numero_immatriculation: numeroImmatriculation,
            numero_formule: numeroFormule,
          },
        },
        options: {
          controles_techniques: true,
          ignore_utac_cache: ignoreUtacCache,
        },
      }
    }
  } else if (typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
    const isoDateEmissionCertificatImmatriculation = dateEmissionCertificatImmatriculation && dateEmissionCertificatImmatriculation.split('/').reverse().join('-')
    if (typePersonne === TYPE_PERSONNE.PARTICULIER) {
      return {
        uuid,
        vehicule: {
          certificat_immatriculation: {
            titulaire: {
              particulier: {
                nom,
                prenoms,
              },
            },
            numero_immatriculation: numeroImmatriculation,
            date_emission_certificat_immatriculation: isoDateEmissionCertificatImmatriculation,
          },
        },
        options: {
          controles_techniques: true,
          ignore_utac_cache: ignoreUtacCache,
        },
      }
    } else {  // typePersonne === TYPE_PERSONNE.PRO
      return {
        uuid,
        vehicule: {
          certificat_immatriculation: {
            titulaire: {
              personne_morale: {
                raison_sociale: raisonSociale,
                siren: siren || DEFAULT_NUMERO_SIREN,
              },
            },
            numero_immatriculation: numeroImmatriculation,
            date_emission_certificat_immatriculation: isoDateEmissionCertificatImmatriculation,
          },
        },
        options: {
          controles_techniques: true,
          ignore_utac_cache: ignoreUtacCache,
        },
      }
    }
  }
}

export const buildReportByCodePayload = (
  uuid,
  {
    id,
    key,
  },
  {
    ignoreUtacCache,
  },
) => {
  const codePartage = `${id}-${key}`

  return {
    uuid,
    vehicule: {
      code: codePartage,
    },
    options: {
      controles_techniques: true,
      ignore_utac_cache: ignoreUtacCache,
    },
  }
}
