/* eslint-disable */

import { FR_DATE_EXTRACT_REGEX, ISO_8601_DATE_EXTRACT_REGEX } from '../../../constant/date/regex.js'
import { FR_DATE_FORMAT } from '../../../constant/date/format.js'

// @todo @booleanNormalization:
// Supprimer la normalisation des booléens lorsque la DATA utilisera des booléens dans tous les champs du V
// et qu'il n'y aura plus aucun "OUI"/"NON" ou "0"/"1"
// /!\ Chantier sujet à régression côté DATA /!\
const normalizeToBoolean = (value) => {
  if (!value && value !== false) { // falsy but not false
    return
  }

  switch (value) {
    case '0':
      return false
    case '1':
      return true
    case true:
    case 'OUI':
      return true
    case false:
    case 'NON':
      return false
    default:
      throw new Error(`${value} of type ${typeof (value)} is not convertible to boolean`)
  }
}

const formatDateFrToEn = (date) => {
  const frDateMatches = date.match(FR_DATE_EXTRACT_REGEX)
  if (frDateMatches && frDateMatches[1] && frDateMatches[2] && frDateMatches[3]) {
    return `${frDateMatches[3]}-${frDateMatches[2]}-${frDateMatches[1]}`
  }

  return null
}

// @todo @isoDateNormalization:
// Supprimer la normalisation des dates lorsque la DATA utilisera des dates au format ISO8601 dans tous les champs du V
// et qu'il n'y aura plus aucune date au format FR (DD/MM/YYYY)
// /!\ Chantier sujet à régression côté DATA /!\
const normalizeToISODate = (value) => {
  if (!value) {
    return
  }

  const dateEn = formatDateFrToEn(value)
  if (dateEn) return dateEn;

  if (value.match(ISO_8601_DATE_EXTRACT_REGEX)) {
    const dateTimeFr = new Date(value).toLocaleDateString(FR_DATE_FORMAT, { timeZone: 'Europe/Paris' })

    const dateTimeEn = formatDateFrToEn(dateTimeFr)
    if (dateTimeEn) return dateTimeEn;
  }

  throw new Error(`${value} of type is not convertible to ISO8601 Date`)
}

const normalizeHistorique = (historique) => {
  return historique.map((operation) => {
    return {
      ...operation,
      opa_date: normalizeToISODate(operation?.opa_date),
      ...(
        operation.ope_date_annul
          ? {
              ope_date_annul: normalizeToISODate(operation.ope_date_annul),
            }
          : {}
      ),
    }
  })
}

const normalizeElementsWithDate = (elements) => {
  return elements.map((element) => {
    return {
      ...element,
      date: normalizeToISODate(element?.date),
    }
  })
}

export const normalizeReport = (report) => {
  const {
    date_annulation_ci,
    date_emission_CI,
    date_premiere_immat,
    date_update,
    dos_date_conversion_siv,
    dos_date_derniere_modif,
    annulation_ci,
    ci_vole,
    duplicata,
    import: is_imported,
    pers_locataire,
    perte_ci,
    vehicule_vole,
    date_derniere_resolution,
    date_dernier_sinistre,
    date_import_france,
    date_premiere_immat_etranger,
    has_pve,
    // @renameHistorique1
    // historique = [],
    new_historique = [],  // Supprimer
    is_apte_a_circuler,
    is_fni,
    sit_adm: {
      suspensions = [],
      dvs = [],
      gages = [],
      opposition: {
        oves = [],
        oveis = [],
        otcis = [],
        otcis_pv = [],
      } = {},
    } = {},
  } = report

  // @renameHistorique2
  // const normalizedHistorique = normalizeHistorique(historique)
  const normalizedNewHistorique = normalizeHistorique(new_historique)  // Supprimer

  const normalizedSitAdm = {
    suspensions: suspensions.map((suspension) => {
      return {
        ...suspension,
        date: normalizeToISODate(suspension?.date),
        remise_titre: normalizeToBoolean(suspension?.remise_titre),
        retrait_titre: normalizeToBoolean(suspension?.retrait_titre),
      }
    }),
    dvs: normalizeElementsWithDate(dvs),
    gages: normalizeElementsWithDate(gages),
    opposition: {
      oves: normalizeElementsWithDate(oves),
      oveis: normalizeElementsWithDate(oveis),
      otcis: normalizeElementsWithDate(otcis),
      otcis_pv: normalizeElementsWithDate(otcis_pv),
    },
  }

  const normalizedReport = {
    ...report,
    ...(
      date_annulation_ci
        ? {
            date_annulation_ci: normalizeToISODate(date_annulation_ci),
          }
        : {}
    ),
    ...(
      date_emission_CI
        ? {
            date_emission_CI: normalizeToISODate(date_emission_CI),
          }
        : {}
    ),
    ...(
      date_premiere_immat
        ? {
            date_premiere_immat: normalizeToISODate(date_premiere_immat),
          }
        : {}
    ),
    ...(
      date_update
        ? {
            date_update: normalizeToISODate(date_update),
          }
        : {}
    ),
    ...(
      dos_date_conversion_siv
        ? {
            dos_date_conversion_siv: normalizeToISODate(dos_date_conversion_siv),
          }
        : {}
    ),
    ...(
      dos_date_derniere_modif
        ? {
            dos_date_derniere_modif: normalizeToISODate(dos_date_derniere_modif),
          }
        : {}
    ),
    ...(
      annulation_ci
        ? {
            annulation_ci: normalizeToBoolean(annulation_ci),
          }
        : {}
    ),
    ...(
      ci_vole
        ? {
            ci_vole: normalizeToBoolean(ci_vole),
          }
        : {}
    ),
    ...(
      duplicata
        ? {
            duplicata: normalizeToBoolean(duplicata),
          }
        : {}
    ),
    ...(
      is_imported
        ? {
            import: normalizeToBoolean(is_imported),
          }
        : {}
    ),
    ...(
      pers_locataire
        ? {
            pers_locataire: normalizeToBoolean(pers_locataire),
          }
        : {}
    ),
    ...(
      perte_ci
        ? {
            perte_ci: normalizeToBoolean(perte_ci),
          }
        : {}
    ),
    ...(
      vehicule_vole
        ? {
            vehicule_vole: normalizeToBoolean(vehicule_vole),
          }
        : {}
    ),
    // @renameHistorique3
    // ...(
    //   historique
    //     ? {
    //       historique: normalizedHistorique,
    //       }
    //     : {}
    // ),
    ...(  // Supprimer ce bloc
      new_historique
        ? {
            new_historique: normalizedNewHistorique,
          }
        : {}
    ),
    sit_adm: normalizedSitAdm,
    ...(
      date_derniere_resolution
        ? {
            date_derniere_resolution: normalizeToISODate(date_derniere_resolution),
          }
        : {}
    ),
    ...(
      date_dernier_sinistre
        ? {
            date_dernier_sinistre: normalizeToISODate(date_dernier_sinistre),
          }
        : {}
    ),
    ...(
      date_import_france
        ? {
            date_import_france: normalizeToISODate(date_import_france),
          }
        : {}
    ),
    ...(
      date_premiere_immat_etranger
        ? {
            date_premiere_immat_etranger: normalizeToISODate(date_premiere_immat_etranger),
          }
        : {}
    ),
    ...(
      has_pve
        ? {
            has_pve: normalizeToBoolean(has_pve),
          }
        : {}
    ),
    ...(
      is_apte_a_circuler
        ? {
            is_apte_a_circuler: normalizeToBoolean(is_apte_a_circuler),
          }
        : {}
    ),
    ...(
      is_fni
        ? {
            is_fni: normalizeToBoolean(is_fni),
          }
        : {}
    ),
  }

  return normalizedReport
}

export const normalizeControlesTechniques = (controlesTechniques) => {
  const {
    ct = [],
    ctUpdateDate,
    utacError,
  } = controlesTechniques

  const normalizedCt = ct.map((ctItem) => (
    {
      ...ctItem,
      ct_date: normalizeToISODate(ctItem.ct_date),
    }
  ))

  return {
    ct: normalizedCt,
    ctUpdateDate: normalizeToISODate(ctUpdateDate),
    utacError,
  }
}
